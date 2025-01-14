import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { fetchAllExercises, fetchData, exerciseOptions } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';
import './SearchExercises.css';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
    const [search, setSearch] = useState('');
    const [bodyParts, setBodyParts] = useState([]);

    useEffect(() => {
        const fetchBodyPartsData = async () => {
            try {
                const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);
                setBodyParts(['all', ...bodyPartsData]);
            } catch (error) {
                console.error('Failed to fetch body parts:', error);
            }
        };

        fetchBodyPartsData();
    }, []);

    const handleSearch = async () => {
        if (search) {
            try {
                const exercisesData = await fetchAllExercises();
                console.log('Fetched exercises:', exercisesData.length);

                const searchedExercises = exercisesData.filter((exercise) =>
                    exercise.name.toLowerCase().includes(search) ||
                    exercise.target.toLowerCase().includes(search) ||
                    exercise.equipment.toLowerCase().includes(search) ||
                    exercise.bodyPart.toLowerCase().includes(search)
                );

                console.log('Searched exercises:', searchedExercises.length);
                setSearch('');
                setExercises(searchedExercises);
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            }
        }
    };

    return (
        <div className="search-container">
            <Typography className="search-title">
                Great Exercises You<br />Should Learn
            </Typography>
            <Box className="search-box">
                <TextField
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Search Exercises"
                    type="text"
                />
                <Button
                    className="search-btn"
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>
            <Box className="horizontal-scrollbar">
                <HorizontalScrollbar data={bodyParts} bodyPart={bodyPart} setBodyPart={setBodyPart} isBodyParts />
            </Box>
        </div>
    );
};

export default SearchExercises;
