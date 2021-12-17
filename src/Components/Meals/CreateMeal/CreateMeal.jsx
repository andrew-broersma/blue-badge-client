import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table
} from 'reactstrap'
import "bootstrap/dist/css/bootstrap.css";
import DisplayFoods from '../DisplayFoods/DisplayFoods';
import DisplayMeal from '../DisplayMeal/DisplayMeal';

const CreateMeal = (props) => {

    const [foods, newFoods] = useState('')
    const [foodInput, newFoodInput] = useState('')
    const [nutroObj, setNutroObj] = useState({})

    const fetchMeals = async () => {
        let urlFoodInput = foodInput.replace(" ", "%20")
        console.log(urlFoodInput);
        const apiKey = process.env.REACT_APP_API_KEY
        console.log(apiKey)
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${urlFoodInput}`

        await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": props.sessionToken
            })
        })
            .then(res => res.json())
            .then(data => newFoods(data.foods))
            .catch(err => console.log(err))

    }

    const foodArr = (data) => {
        let foodObj = {};
        for (let i = 0; i < data.length; i++) {
            let foodName = data[i].description
            foodObj[i] = [foodName]
            if (i === 5) {
                break;
            } else {
                let nutritionArr = data[i].foodNutrients;
                for (let j = 0; j <= nutritionArr.length - 1; j++) {
                    if (nutritionArr[j].nutrientId === 1003) {
                        let proVal = nutritionArr[j].value
                        foodObj[i].push(proVal)
                        console.log("Protein", proVal);
                    }
                    if (nutritionArr[j].nutrientId === 1005) {
                        let carbVal = nutritionArr[j].value
                        foodObj[i].push(carbVal)
                        console.log("Carb:", carbVal);
                    }
                    if (nutritionArr[j].nutrientId === 1004) {
                        let fatVal = nutritionArr[j].value
                        // newFats(fatVal)
                        foodObj[i].push(fatVal)
                        console.log("Fat:", fatVal);
                    }
                    if (nutritionArr[j].nutrientId === 1008) {
                        let cal = nutritionArr[j].value
                        // newKCal(cal)
                        foodObj[i].push(cal)
                        console.log("KCal", cal);
                    }
                }
                // nutroArr.push(proVal, carbVal, fatVal, cal)
                // console.log(nutroArr);
            }
        }
        console.log(foodObj);
        setNutroObj(foodObj)
        console.log(nutroObj);
    }
    console.log(foods)
    

    // console.log(protein);
    useEffect(() => {
        // console.log(setNames(foods))
        foodArr(foods)
    }, [foods])


    return (
        <div>
            <Modal size="m"
                isOpen={props.displayMeal}
                toggle={props.toggleModal}
            >
                <ModalHeader toggle={props.toggleModal}>
                    Search for a food:
                </ModalHeader>
                <ModalBody>
                    <input type="text" onChange={(e) => newFoodInput(e.target.value)} />
                    {console.log(nutroObj)}
                    {/* {!nutroObj ? null : <Table><DisplayMeal nutroObj={nutroObj} /></Table>} */}
                    <Table>
                        <DisplayMeal 
                            nutroObj={nutroObj} 
                            fetchMeals={props.fetchMeals} 
                            toggleModal={props.toggleModal} 
                            displayInRightSpot={props.displayInRightSpot} 
                            category={props.category} 
                            userIdNow={props.userIdNow} 
                            mealCat={props.mealCat} 
                            sessionToken={props.sessionToken}
                        />
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={fetchMeals}>
                        Submit
                    </Button>
                    {' '}
                    <Button onClick={props.toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default CreateMeal;