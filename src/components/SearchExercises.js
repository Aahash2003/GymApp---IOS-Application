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
        <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
            <Typography fontWeight={700} className="search-title" textAlign="center">
                Great Exercises You<br />Should Learn
            </Typography>
            <Box position="relative" mb="72px">
                <TextField
                    className="search-input"
                    height="76px"
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
        </Stack>
    );
};

export default SearchExercises;
