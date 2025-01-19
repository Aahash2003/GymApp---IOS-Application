import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const ViewCalories = ({ calories, selectedDate, onDeleteSuccess }) => {
    const [filteredCalories, setFilteredCalories] = useState([]);
    const email = localStorage.getItem('email');

    useEffect(() => {
        const selectedDateUTC = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        ));

        const filtered = calories.filter((log) => {
            const logDate = new Date(log.date);
            const logDateUTC = new Date(Date.UTC(
                logDate.getFullYear(),
                logDate.getMonth(),
                logDate.getDate()
            ));
            return logDateUTC.toDateString() === selectedDateUTC.toDateString();
        });

        setFilteredCalories(filtered);
    }, [selectedDate, calories]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}api/calories/logcalories/${id}`);
            onDeleteSuccess();
        } catch (error) {
            alert('Error deleting calorie log');
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">View Calories</h2>
            <p className="text-gray-700 mb-4">Logs for {selectedDate.toDateString()}</p>
            <ul className="space-y-4">
                {filteredCalories.map((log) => (
                    <li key={log._id} className="p-4 border rounded shadow-sm">
                        <p><strong>Calories:</strong> {log.calories} kcal</p>
                        <p><strong>Protein:</strong> {log.protein} g</p>
                        <p><strong>Carbohydrates:</strong> {log.carbohydrates} g</p>
                        <p><strong>Fats:</strong> {log.fats} g</p>
                        <button
                            onClick={() => handleDelete(log._id)}
                            className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </li>
                ))}
                {filteredCalories.length === 0 && (
                    <div className="mt-4 p-3 border rounded bg-blue-100 text-blue-700">
                        No logs found for this date.
                    </div>
                )}
            </ul>
        </div>
    );
};

ViewCalories.propTypes = {
    calories: PropTypes.array.isRequired,
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    onDeleteSuccess: PropTypes.func.isRequired,
};

export default ViewCalories;
