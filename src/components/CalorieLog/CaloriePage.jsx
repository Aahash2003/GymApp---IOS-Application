import React, { Component } from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import LogCalories from './LogCalories';
import ViewCalories from './ViewCalories';
import FoodSearch from './FoodSearch';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
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
      // Convert each log's date from UTC to local time before updating the state
      const calories = response.data.map(log => ({
        ...log,
        date: new Date(log.date).toLocaleString(), // Convert from UTC to local time
      }));
      this.setState({ calories });
    } catch (error) {
      console.error('Error fetching calorie data:', error);
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
      console.log("API Response:", response.data);
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
    } catch (error) {
      console.error('Error fetching remaining calories and macros:', error);
    }
  };

  handleLogSuccess = () => {
    this.fetchCalories();
    this.fetchRemainingCaloriesAndMacros(); // Update macros as well
  };

  handleDeleteSuccess = () => {
    this.fetchCalories();
    this.fetchRemainingCaloriesAndMacros(); // Update macros as well
  };

  handleFoodSuccess = () => {
    this.fetchCalories();
    this.fetchRemainingCaloriesAndMacros(); // Update macros as well
  };

  handleDateChange = (date) => {
    console.log("Date selected:", date);
    this.setState({ selectedDate: date }, () => {
        console.log("State after date change:", this.state.selectedDate);
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
      <Box p={5} maxW="1200px" mx="auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Calories Management
        </Heading>
  
        {remainingCalories !== undefined && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" textAlign="center">
            <Text fontSize="large">
              <strong>Remaining Daily Caloric Intake:</strong> {remainingCalories} calories/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Protein:</strong> {remainingProtein} g/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Carbs:</strong> {remainingCarbs} g/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Fats:</strong> {remainingFats} g/day
            </Text>
          </Box>
        )}
  
        <Box mb={6}>
          <Calendar
            onChange={this.handleDateChange}
            value={selectedDate}
          />
        </Box>
        <VStack spacing={6}>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <FoodSearch selectedDate={selectedDate} onFoodSuccess={this.handleFoodSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <LogCalories selectedDate={selectedDate} onLogSuccess={this.handleLogSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <ViewCalories calories={calories} selectedDate={selectedDate} onDeleteSuccess={this.handleDeleteSuccess} />
          </Box>
        </VStack>
      </Box>
    );
  }
}

export default CaloriePage;
