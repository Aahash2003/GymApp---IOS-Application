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
      // Convert the selected date to UTC for the backend
      const localDate = new Date(selectedDate);
      const utcDate = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      ));

      const response = await axios.post(`${baseURL}api/calories/logcalories`, {
        email,
        localDate: utcDate.toISOString(), // Send the date in UTC format
        calories,
        protein,
        carbohydrates,
        fats,
      });

      console.log(response.data);
      setCalories(''); // Clear the form fields
      setProtein('');
      setCarbohydrates('');
      setFats('');
      onLogSuccess(); 
    } catch (error) {
      console.error(error);
      console.log('Error logging calories');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log Calories</h2>
      <p>Logging calories for {selectedDate.toDateString()}</p>

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Protein"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Carbohydrates"
        value={carbohydrates}
        onChange={(e) => setCarbohydrates(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Fats"
        value={fats}
        onChange={(e) => setFats(e.target.value)}
        required
      />
      <button type="submit">Log</button>
    </form>
  );
};

export default LogCalories;
