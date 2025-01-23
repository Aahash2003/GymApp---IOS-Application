import React, { useState } from 'react';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const FoodSearch = ({ selectedDate, onFoodSuccess }) => {
    const [query, setQuery] = useState('');
    const [macros, setMacros] = useState(null);
    const [servings, setServings] = useState();
    const email = localStorage.getItem('email');

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${baseURL}api/calories/macros?query=${query}&servings=${servings}`);
            setMacros(response.data);
        } catch (error) {
            alert('Error fetching macro information');
        }
    };

    const handleLogFood = async () => {
        if (macros) {
            const localDate = new Date(selectedDate);
            const utcDate = new Date(Date.UTC(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate()
            ));

            try {
                await axios.post(`${baseURL}api/calories/macros/log`, {
                    email,
                    date: utcDate.toISOString(),
                    item: macros.item,
                    calories: macros.calories,
                    protein: macros.proteins,
                    carbohydrates: macros.carbohydrates,
                    fats: macros.fats,
                    servings
                });
                onFoodSuccess();
            } catch (error) {
                alert('Error logging food item');
            }
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Food Search</h2>
            <form onSubmit={handleSearch} className="space-y-4">
                <input
                    type="text"
                    placeholder="Search food"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Search
                </button>
            </form>
            {macros && (
                <div className="mt-6 p-4 border rounded bg-gray-100">
                    <h3 className="text-lg font-bold mb-2">{macros.item}</h3>
                    <p>Carbohydrates: {macros.carbohydrates} g</p>
                    <p>Fats: {macros.fats} g</p>
                    <p>Proteins: {macros.proteins} g</p>
                    <p>Calories: {macros.calories} kcal</p>
                    <button
                        onClick={handleLogFood}
                        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                        Log {servings} serving(s) to Calorie Log for {selectedDate.toDateString()}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FoodSearch;
