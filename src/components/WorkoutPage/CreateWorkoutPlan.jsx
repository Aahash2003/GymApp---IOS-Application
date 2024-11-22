/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';


const CreateWorkoutPlan = ({ categories, onPlanCreated }) => {
    const [planName, setPlanName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [workouts, setWorkouts] = useState([]); // Replace with actual workout fetching logic

    const handleCreatePlan = async () => {
        if (!planName.trim()) {
            alert('Please enter a plan name.');
            return;
        }

        if (!selectedCategory) {
            alert('Please select a category.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}api/workout/createWorkoutPlan`, {
                email: localStorage.getItem('email'),
                planName: planName.trim(),
                description: description.trim(),
                category: selectedCategory,
                workouts: workouts.map(workout => workout._id), // Replace with actual workout IDs
            });
            alert('Workout plan created successfully');
            onPlanCreated(); // Refresh the workout plan list in the parent component
            setPlanName('');
            setDescription('');
            setSelectedCategory('');
        } catch (error) {
            alert('Error creating workout plan: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h3>Create New Workout Plan</h3>
            <input
                type="text"
                placeholder="Plan Name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <button onClick={handleCreatePlan}>Create Workout Plan</button>
        </div>
    );
};

export default CreateWorkoutPlan;
*/