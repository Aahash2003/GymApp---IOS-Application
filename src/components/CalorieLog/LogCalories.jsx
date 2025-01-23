import React, { useState } from 'react';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const LogCalories = ({ selectedDate, onLogSuccess }) => {
    const email = localStorage.getItem('email');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbohydrates, setCarbohydrates] = useState('');
    const [fats, setFats] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const localDate = new Date(selectedDate);
            const utcDate = new Date(Date.UTC(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate()
            ));

            await axios.post(`${baseURL}api/calories/logcalories`, {
                email,
                localDate: utcDate.toISOString(),
                calories,
                protein,
                carbohydrates,
                fats,
            });

            setCalories('');
            setProtein('');
            setCarbohydrates('');
            setFats('');
            onLogSuccess();
        } catch (error) {
            alert('Error logging calories');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold">Log Calories</h2>
            <p className="text-gray-700">Logging calories for {selectedDate.toDateString()}</p>

            <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
            />
            <input
                type="number"
                placeholder="Protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
            />
            <input
                type="number"
                placeholder="Carbohydrates"
                value={carbohydrates}
                onChange={(e) => setCarbohydrates(e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
            />
            <input
                type="number"
                placeholder="Fats"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                required
                className="w-full p-2 border rounded mb-2"
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Log
            </button>
        </form>
    );
};

export default LogCalories;
