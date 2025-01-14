import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreateCategory from './CreateCategory';
import HorizontalScrollbar from './HorizontalScrollBar';
//import './Workout.css';
import {Alert, AlertIcon,} from '@chakra-ui/react';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';


const WorkoutLogger = () => {
    const email = localStorage.getItem('email'); // Local storage set in the login

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [workoutsByCategory, setWorkoutsByCategory] = useState([]);
    const [error, setError] = useState('');
    const [selectedWorkout, setSelectedWorkout] = useState(null); // New state for selected workout
    const [exercises, setExercises] = useState([
        {name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: ''}
    ]);
    const [workouts, setWorkouts] = useState([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchCategories();
    }, [email]);

    const fetchCategories = async () => {
        const email = localStorage.getItem('email'); // Retrieve email from localStorage
        if (!email) {
            setError('User email is missing. Please log in again.');
            return;
        }

        try {
            const response = await axios.get(`${baseURL}api/workout/workoutCategories`, {
                params: {email}  // Pass email as a query parameter
            });
            setCategories(response.data);
        } catch (error) {
            setError('Error fetching workout categories: ' + error.message);
        }
    };

    useEffect(() => {
        if (email && date) {
            fetchWorkouts();
        }
    }, [email, date]);

    const fetchWorkouts = async () => {
        try {
            // Send the UTC date string (YYYY-MM-DD)
            const utcDate = date.toISOString().split('T')[0];

            const response = await axios.get(`${baseURL}api/workout/user/${email}/workouts`, {
                params: {
                    date: utcDate // Send the UTC date
                }
            });

            // Set the workouts directly
            setWorkouts(response.data);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching workouts: ' + error.message);
        }
    };


    const fetchWorkoutsByCategory = async (categoryId) => {
        const email = localStorage.getItem('email'); // Retrieve email from localStorage
        if (!email) {
            setError('User email is missing. Please log in again.');
            return;
        }

        try {
            const response = await axios.get(`${baseURL}api/workout/category/${categoryId}/workouts`, {
                params: {email}
            });
            setWorkoutsByCategory(response.data);

            // Filter out duplicate workouts by comparing exercise names
            const uniqueWorkouts = response.data.reduce((acc, workout) => {
                const existingWorkout = acc.find(w => w.exercises.map(e => e.name).sort().join(', ') === workout.exercises.map(e => e.name).sort().join(', '));
                if (!existingWorkout) {
                    acc.push(workout);
                }
                return acc;
            }, []);

            setWorkoutsByCategory(uniqueWorkouts);
        } catch (error) {
            setError('Error fetching workouts by category: ' + error.message);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedWorkout(null); // Reset selected workout
        if (categoryId) {
            fetchWorkoutsByCategory(categoryId); // Fetch workouts for the selected category
        } else {
            setWorkoutsByCategory([]); // Clear workouts if no category is selected
        }
    };

    const onCategoryCreated = () => {
        // This function should re-fetch the categories or update the state in some way
        fetchCategories();
    };
    const handleDeleteCategory = async (categoryId) => {
        const email = localStorage.getItem('email');
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await axios.delete(`${baseURL}api/workout/category/${categoryId}`, {
                data: {email}
            });
            setError('Category deleted successfully');
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            setError('Error deleting category: ' + (error.response?.data?.message || error.message));
        }
    };


    const handleWorkoutSelect = (workoutId) => {
        const workout = workoutsByCategory.find(w => w._id === workoutId);
        setSelectedWorkout(workout);
        if (workout) {
            setExercises(workout.exercises); // Populate form with existing workout data
        }
    };

    /* const handleAddExercise = () => {
       setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: '' }]);
     };
     */

    const handleRemoveExercise = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = exercises.map((exercise, i) => {
            if (i === index) {
                const updatedExercise = {...exercise, [field]: value};

                // Automatically calculate the one rep max when weight or reps change
                if (field === 'weight' || field === 'reps') {
                    const weightValue = parseFloat(updatedExercise.weight);
                    const repsValue = parseInt(updatedExercise.reps, 10);

                    if (!isNaN(weightValue) && !isNaN(repsValue) && repsValue > 0) {
                        const calculatedOneRepMax = (weightValue / (1.0278 - 0.0278 * repsValue)).toFixed(2);
                        updatedExercise.oneRepMax = calculatedOneRepMax;
                    } else {
                        updatedExercise.oneRepMax = '';
                    }
                }

                return updatedExercise;
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    const handleLogWorkout = async () => {
        if (!selectedCategory) {
            setError('Please select a workout category.');
            return;
        }

        if (exercises.length === 0 || !exercises[0].name.trim()) {
            setError('Please add at least one exercise with a valid name.');
            return;
        }

        try {
            // Validate and parse the date
            const parsedDate = date ? new Date(date) : new Date();
            if (isNaN(parsedDate.getTime())) {
                setError('Invalid date selected. Please choose a valid date.');
                return;
            }

            const payload = {
                exercises,
                email,
                date: parsedDate.toISOString(),  // Include the validated date
                categoryId: selectedCategory,
            };

            if (selectedWorkout && new Date(selectedWorkout.date).toISOString() === parsedDate.toISOString()) {
                payload.workoutId = selectedWorkout._id; // Only pass the workoutId if editing the exact same workout
            }

            //const response = await axios.post(`${baseURL}api/workout/logWorkout`, payload);
            setError('Workout logged successfully');
            fetchWorkoutsByCategory(selectedCategory);  // Refresh the workouts list
        } catch (error) {
            console.error("Error logging workout:", error.response?.data || error.message);
            setError('Error logging workout: ' + (error.response?.data?.message || error.message));
        }
    };


    const onDateChange = (newDate) => {
        setDate(newDate);
        fetchWorkouts();
    };

// const filteredWorkouts = workoutsByCategory.filter(workout => {
//     const workoutDate = new Date(workout.date).toDateString();
//     const selectedDate = date.toDateString();
//     return workoutDate === selectedDate;
// });


    return (
        <div className="max-w-5xl mx-auto p-5 bg-white rounded-lg shadow-lg">
            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">
                Your Workouts for {date.toDateString()}
            </h2>

            {workouts.length > 0 ? (
                <ul className="space-y-4">
                    {workouts.map((workout) => {
                        const workoutDate = new Date(workout.date).toLocaleDateString();
                        const selectedDate = date.toLocaleDateString();

                        if (workoutDate === selectedDate) {
                            return (
                                <li key={workout._id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <ul className="space-y-2">
                                        {workout.exercises.map((exercise, index) => (
                                            <li key={index}>
                                                {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No workouts logged for this date.</p>
            )}

            <h2 className="text-center text-xl font-semibold my-5">{date.toDateString()}</h2>

            <div className="mb-5">
                <Calendar onChange={onDateChange} value={date} className="rounded-lg shadow-md" />
            </div>

            <CreateCategory
                onCategoryCreated={onCategoryCreated}
                categories={categories}
                handleDeleteCategory={handleDeleteCategory}
            />

            <div className="my-5">
                <HorizontalScrollbar
                    categories={categories}
                    handleCategoryChange={handleCategoryChange}
                    selectedCategory={selectedCategory}
                    handleDeleteCategory={handleDeleteCategory}
                />
            </div>

            {workoutsByCategory.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-3">Workouts in Selected Category</h3>
                    <ul className="space-y-4">
                        {workoutsByCategory.map((workout) => (
                            <li key={workout._id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                                <strong>{workout.exercises.map((e) => e.name).join(', ')}</strong>
                                <button className="block w-full mt-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleWorkoutSelect(workout._id)}>
                                    Edit Workout
                                </button>
                                <ul className="space-y-2">
                                    {workout.exercises.map((exercise, index) => (
                                        <li key={index}>
                                            {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h3 className="text-lg font-bold mt-5">Exercises</h3>

            {exercises.map((exercise, index) => (
                <div key={index} className="mb-5 p-4 bg-gray-100 rounded-lg">
                    <input
                        type="text"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Exercise Name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    />
                    <input
                        type="number"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                    />
                    <input
                        type="number"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                    />
                    <input
                        type="number"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Weight"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                    />
                    <input
                        type="number"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Rest Time"
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
                    />
                    <input
                        type="number"
                        className="block w-full mb-3 p-2 border border-gray-300 rounded"
                        placeholder="Current Rep Max"
                        value={exercise.currentRepMax}
                        onChange={(e) => handleExerciseChange(index, 'currentRepMax', e.target.value)}
                    />
                    <div className="flex items-center mt-3">
                        <input
                            type="text"
                            className="w-64 p-2 border border-gray-300 rounded text-center font-bold"
                            placeholder="One Rep Max"
                            value={exercise.oneRepMax}
                            readOnly
                        />
                        <span className="ml-2 font-bold text-gray-800">LBS</span>
                    </div>
                    {exercises.length > 1 && (
                        <button className="mt-3 p-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleRemoveExercise(index)}>
                            Remove Exercise
                        </button>
                    )}
                </div>
            ))}

            <button
                className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 mt-5"
                onClick={handleLogWorkout}
            >
                {selectedWorkout ? 'Update Workout' : 'Log Workout'} for {date.toDateString()}
            </button>
        </div>
    );



};

export default WorkoutLogger;
