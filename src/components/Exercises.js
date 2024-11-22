import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Box, Stack, Typography } from '@mui/material/';

import { exerciseOptions, fetchData } from '../utils/fetchData';

import ExerciseCard from './ExerciseCard';

const Exercises = ({ exercises, setExercises, bodyPart }) => {

  const[currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage= 9;

  const indexOfLastEx= currentPage*exercisesPerPage;
  const indexOfFirstEx= indexOfLastEx-exercisesPerPage;
  const currentEx= exercises.slice(indexOfFirstEx, indexOfLastEx);


  const paginate = (e, value ) => {
    setCurrentPage(value);

    window.scrollTo({top:1800, behavior: 'smooth'})

  }

  useEffect(() =>{
    const fetchExerciseData = async () => {
      let exercisesData = [];

      if(bodyPart === 'all') {
        exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises?limit=50', exerciseOptions);
      }
      else{
        exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=50`, exerciseOptions);
      }

      setExercises(exercisesData);
    }
  fetchExerciseData();
  }
     , [bodyPart]);

  return (
    <Box id="exercises"
      sx={{ mt: { jg: '110px' } }}
      mt="50px"
      p="20px"
    >

      <Typography variant="h3" mb="46px">
        Showing Results
      </Typography>
      <Stack direction="row" sx={{ gap: { lg: '110px', xs: '5opx' } }}
        flexWrap="wrap" justifyContent="center">
        {currentEx.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}

      </Stack>
      <Stack mt="100px" alignItems="center">
        {exercises.length > 9 && (
          <Pagination
          color="standard"
          shape="rounded"
          defaultPage={1}
          count={Math.ceil(exercises.length / exercisesPerPage)}
          page={currentPage}
          onChange={paginate}
          //materialUI for info on this
          />
        )}

      </Stack>
    </Box>
  )
}

export default Exercises