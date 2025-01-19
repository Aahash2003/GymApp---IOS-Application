import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import FoodSearch from './FoodSearch';
import LogCalories from './LogCalories';
import ViewCalories from './ViewCalories';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

class CaloriePage extends Component {
    state = {
        calories: [],
        email: localStorage.getItem('email'),
        selectedDate: new Date(),
        storedCalories: localStorage.getItem('dailyCalories'),
        Macros: JSON.parse(localStorage.getItem('MacroGrams')),
        remainingCalories: undefined,
        remainingProtein: undefined,
        remainingCarbs: undefined,
        remainingFats: undefined
    };

    componentDidMount() {
        this.fetchCalories();
        this.fetchRemainingCaloriesAndMacros();
    }

    fetchCalories = async () => {
        const { email, selectedDate } = this.state;
        try {
            const utcDate = this.convertToUTC(selectedDate);
            const response = await axios.get(`${baseURL}api/calories/user/${email}/calories`, {
                params: { date: utcDate.toISOString().split('T')[0] }
            });
            const calories = response.data.map(log => ({
                ...log,
                date: new Date(log.date).toLocaleString()
            }));
            this.setState({ calories });
        } catch (error) {
            alert('Error fetching calorie data');
        }
    };

    fetchRemainingCaloriesAndMacros = async () => {
        const { email, selectedDate } = this.state;
        try {
            const utcDate = this.convertToUTC(selectedDate);
            const response = await axios.get(`${baseURL}api/calc/user/${email}/remaining-calories`, {
                params: { date: utcDate.toISOString().split('T')[0] }
            });
            const remainingCalories = parseFloat(response.data.remainingCalories).toFixed(2);
            const remainingProtein = parseFloat(response.data.remainingProtein).toFixed(2);
            const remainingCarbs = parseFloat(response.data.remainingCarbs).toFixed(2);
            const remainingFats = parseFloat(response.data.remainingFats).toFixed(2);
            this.setState({
                remainingCalories,
                remainingProtein,
                remainingCarbs,
                remainingFats
            });
        } catch (error) {}
    };

    handleLogSuccess = () => {
        this.fetchCalories();
        this.fetchRemainingCaloriesAndMacros();
    };

    handleDeleteSuccess = () => {
        this.fetchCalories();
        this.fetchRemainingCaloriesAndMacros();
    };

    handleFoodSuccess = () => {
        this.fetchCalories();
        this.fetchRemainingCaloriesAndMacros();
    };

    handleDateChange = (date) => {
        this.setState({ selectedDate: date }, () => {
            this.fetchCalories();
            this.fetchRemainingCaloriesAndMacros();
        });
    };

    convertToUTC = (date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    render() {
        const { calories, selectedDate, storedCalories, Macros, remainingCalories, remainingProtein, remainingCarbs, remainingFats } = this.state;

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">Calories Management</h1>

                {remainingCalories !== undefined && (
                    <div className="mb-4 p-4 border rounded shadow-md text-center">
                        <p className="text-lg font-medium">Remaining Daily Caloric Intake: {remainingCalories} calories/day</p>
                        <p className="text-lg font-medium">Remaining Protein: {remainingProtein} g/day</p>
                        <p className="text-lg font-medium">Remaining Carbs: {remainingCarbs} g/day</p>
                        <p className="text-lg font-medium">Remaining Fats: {remainingFats} g/day</p>
                    </div>
                )}

                <div className="mb-6">
                    <Calendar
                        onChange={this.handleDateChange}
                        value={selectedDate}
                        className="rounded shadow-md"
                    />
                </div>

                <div className="space-y-6">
                    <div className="p-5 border rounded shadow-md">
                        <FoodSearch selectedDate={selectedDate} onFoodSuccess={this.handleFoodSuccess} />
                    </div>
                    <div className="p-5 border rounded shadow-md">
                        <LogCalories selectedDate={selectedDate} onLogSuccess={this.handleLogSuccess} />
                    </div>
                    <div className="p-5 border rounded shadow-md">
                        <ViewCalories calories={calories} selectedDate={selectedDate} onDeleteSuccess={this.handleDeleteSuccess} />
                    </div>
                </div>
            </div>
        );
    }
}

export default CaloriePage;
