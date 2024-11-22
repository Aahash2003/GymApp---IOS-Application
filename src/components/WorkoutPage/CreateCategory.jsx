import React, { useState } from 'react';
import axios from 'axios';
import image from './Equipment Sign.png'; // Replace with your designated image path
import {Alert, AlertIcon,} from '@chakra-ui/react';

const email = localStorage.getItem('email');

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

const CreateCategory = ({ onCategoryCreated, categories, handleDeleteCategory }) => {  // Accept handleDeleteCategory as a prop
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            setError('Please enter a category name.');
            return;
        }

        if (!email) {
            setError('User email is missing. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}api/workout/createCategory`, {
                name: categoryName.trim(),
                description: description.trim(),
                imageUrl: image,
                email,
            });
            console.log('Category created successfully');
            onCategoryCreated();
            setCategoryName('');
            setDescription('');
        } catch (error) {
            setError('Error creating category: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
            <h3>Create New Workout Category</h3>
            <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateCategory}>Create Category</button>
            <div>
                
            </div>
        </div>
    );
};

export default CreateCategory;
