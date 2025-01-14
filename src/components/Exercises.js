import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
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
      <div id="exercises" className="mt-[50px] p-5 lg:mt-[110px]">
        <h3 className="text-3xl font-bold mb-12">Showing Results</h3>
        <div className="flex flex-wrap justify-center gap-[110px] sm:gap-[50px]">
          {currentEx.map((exercise, index) => (
              <ExerciseCard key={index} exercise={exercise} />
          ))}
        </div>
        <div className="mt-24 flex justify-center">
          {exercises.length > 9 && (
              <Pagination
                  color="standard"
                  shape="rounded"
                  defaultPage={1}
                  count={Math.ceil(exercises.length / exercisesPerPage)}
                  page={currentPage}
                  onChange={paginate}
              />
          )}
        </div>
      </div>
  );

}

export default Exercises