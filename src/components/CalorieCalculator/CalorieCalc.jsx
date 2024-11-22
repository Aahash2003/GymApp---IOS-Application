import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Select,
} from '@chakra-ui/react';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const CalorieCalc = () => {
  const [formData, setFormData] = useState({
    targetWeight: '',
    startDate: '',
    endDate: '',
  });
  const [macroForm, setMacroForm] = useState({
    fat: '',
    protein: '',
    carbohydrates: '',
    type: 'maintenance', // Default to maintenance, can be 'maintenance' or 'daily'
  });
  const [calorieMaintenance, setCalorieMaintenance] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [macroGrams, setMacroGrams] = useState({
    fatGrams: null,
    proteinGrams: null,
    carbGrams: null,
  });
  const [error, setError] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Fetch the caloric maintenance as soon as the component mounts
    const fetchCaloricMaintenance = async () => {
      try {
        const res = await axios.get(`${baseURL}api/calc/calculate/${email}`);
        const maintenanceValue = parseFloat(res.data.calorie_Maintenance).toFixed(2);
        setCalorieMaintenance(maintenanceValue);
      } catch (err) {
        setError('Please initialize your profile prior to calculating your Caloric Intake.');
        setCalorieMaintenance(null);
      }
    };

    fetchCaloricMaintenance();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMacroChange = (e) => {
    setMacroForm({ ...macroForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${baseURL}api/calc/calculate-DC/${email}`, {
        params: formData,
      });
      const dailyCaloriesValue = parseFloat(res.data.dailyCalories).toFixed(2);
      setDailyCalories(dailyCaloriesValue);
      setError('');
    } catch (err) {
      setError('Error calculating daily calories. Please check your input and try again.');
      setDailyCalories(null);
    }
  };

  const handleStoreCaloricValue = async (type) => {
    try {
      const caloricValue = type === 'maintenance' ? calorieMaintenance : dailyCalories;
      await axios.post(`${baseURL}api/calc/store-caloric-value`, {
        email,
        [type === 'maintenance' ? 'caloricMaintenance' : 'dailyCalories']: caloricValue,
      });
      localStorage.setItem('dailyCalories', caloricValue);
      console.log('Caloric value stored successfully!');
    } catch (err) {
      setError('Error storing caloric value. Please try again later.');
    }
  };

  const handleCalculateMacros = async (e) => {
    e.preventDefault();
    const totalPercentage = parseFloat(macroForm.fat) + parseFloat(macroForm.protein) + parseFloat(macroForm.carbohydrates);
    if (totalPercentage !== 100) {
      setError('The total macronutrient percentages must equal 100%.');
      return;
    }

    try {
      const res = await axios.get(`${baseURL}api/calc/calculate-macros/${email}`, {
        params: {
          ...macroForm,
          fat: parseFloat(macroForm.fat),
          protein: parseFloat(macroForm.protein),
          carbohydrates: parseFloat(macroForm.carbohydrates),
        },
      });
      const macros = {
        fatGrams: res.data.fatGrams.toFixed(2),
        proteinGrams: res.data.proteinGrams.toFixed(2),
        carbGrams: res.data.carbGrams.toFixed(2),
      };
      setMacroGrams(macros);
      localStorage.setItem("MacroGrams", JSON.stringify(macros)); // Store the updated macroGrams in local storage
      setError('');
    } catch (err) {
      setError('Error calculating macronutrient grams. Please check your input and try again.');
      setMacroGrams({
        fatGrams: null,
        proteinGrams: null,
        carbGrams: null,
      });
    }
  };

  const handleStoreMacros = async () => {
    try {
      // Make a post request to store macros in the backend
      await axios.post(`${baseURL}api/calc/store-macros/${email}`, macroGrams);
      localStorage.setItem("MacroGrams", JSON.stringify(macroGrams)); // Store the calculated macros in local storage
      console.log('Macros stored successfully!');
    } catch (err) {
      setError('Error storing macronutrient values. Please try again later.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" size="lg" mb={6}>
        Daily Caloric Calculator
      </Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="targetWeight" isRequired>
            <FormLabel>Target Weight (kg)</FormLabel>
            <Input
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="startDate" isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="endDate" isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Calculate Daily Calories
          </Button>
        </Stack>
      </form>
      {calorieMaintenance !== null && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
          <Text><strong>Caloric Maintenance:</strong> {calorieMaintenance} calories/day</Text>
          <Button colorScheme="blue" onClick={() => handleStoreCaloricValue('maintenance')}>
            Store Caloric Maintenance
          </Button>
        </Box>
      )}
      {dailyCalories !== null && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
          <Text><strong>Daily Caloric Intake to Reach Goal:</strong> {dailyCalories} calories/day</Text>
          <Button colorScheme="blue" onClick={() => handleStoreCaloricValue('daily')}>
            Store Daily Caloric Intake
          </Button>
        </Box>
      )}
      <Box mt={8}>
        <Heading as="h2" size="md" mb={4}>
          Adjust Macronutrient Ratios
        </Heading>
        <form onSubmit={handleCalculateMacros}>
          <Stack spacing={4}>
            <FormControl id="macroType" isRequired>
              <FormLabel>Caloric Value Type</FormLabel>
              <Select name="type" value={macroForm.type} onChange={handleMacroChange}>
                <option value="maintenance">Caloric Maintenance</option>
                <option value="daily">Daily Caloric Intake</option>
              </Select>
            </FormControl>
            <FormControl id="fat" isRequired>
              <FormLabel>Fat (%)</FormLabel>
              <Input
                type="number"
                name="fat"
                value={macroForm.fat}
                onChange={handleMacroChange}
              />
            </FormControl>
            <FormControl id="protein" isRequired>
              <FormLabel>Protein (%)</FormLabel>
              <Input
                type="number"
                name="protein"
                value={macroForm.protein}
                onChange={handleMacroChange}
              />
            </FormControl>
            <FormControl id="carbohydrates" isRequired>
              <FormLabel>Carbohydrates (%)</FormLabel>
              <Input
                type="number"
                name="carbohydrates"
                value={macroForm.carbohydrates}
                onChange={handleMacroChange}
              />
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Calculate Macronutrient Grams
            </Button>
          </Stack>
        </form>
        {macroGrams.fatGrams !== null && (
          <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
            <Text><strong>Fat:</strong> {macroGrams.fatGrams} grams/day</Text>
            <Text><strong>Protein:</strong> {macroGrams.proteinGrams} grams/day</Text>
            <Text><strong>Carbohydrates:</strong> {macroGrams.carbGrams} grams/day</Text>
            <Button colorScheme="blue" mt={4} onClick={handleStoreMacros}>
              Store Macros
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CalorieCalc;
