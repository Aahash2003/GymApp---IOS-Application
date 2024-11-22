import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, Heading, Text, List, ListItem, Button, Alert } from '@chakra-ui/react';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';


const ViewCalories = ({ calories, selectedDate, onDeleteSuccess }) => {
  const [filteredCalories, setFilteredCalories] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Convert selectedDate to UTC for accurate comparison
    const selectedDateUTC = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));

    // Filter the calories based on the selected date (in UTC)
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
      console.log('Calorie log deleted');
      onDeleteSuccess(); // Trigger the parent to refresh the logs
    } catch (error) {
      console.error('Error deleting calorie log:', error);
      console.log('Error deleting calorie log');
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        View Calories
      </Heading>
      <Text fontSize="lg" mb={4}>
        Logs for {selectedDate.toDateString()}
      </Text>
      <List spacing={3}>
        {filteredCalories.map((log) => (
          <ListItem key={log._id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
            <Text><strong>Calories:</strong> {log.calories} kcal</Text>
            <Text><strong>Protein:</strong> {log.protein} g</Text>
            <Text><strong>Carbohydrates:</strong> {log.carbohydrates} g</Text>
            <Text><strong>Fats:</strong> {log.fats} g</Text>
            <Button mt={2} colorScheme="red" size="sm" onClick={() => handleDelete(log._id)}>
              Delete
            </Button>
          </ListItem>
        ))}
        {filteredCalories.length === 0 && (
          <Alert status="info" mt={4}>
            No logs found for this date.
          </Alert>
        )}
      </List>
    </Box>
  );
};

// Define PropTypes for the component to ensure correct prop usage
ViewCalories.propTypes = {
  calories: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default ViewCalories;
