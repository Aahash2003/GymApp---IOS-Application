import React, { useEffect, useState } from 'react';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';

const Exercises = ({ exercises, setExercises, bodyPart }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const exercisesPerPage = 9;

    const indexOfLastEx = currentPage * exercisesPerPage;
    const indexOfFirstEx = indexOfLastEx - exercisesPerPage;
    const currentEx = isMobile ? exercises : exercises.slice(indexOfFirstEx, indexOfLastEx);

    const totalPages = Math.ceil(exercises.length / exercisesPerPage);

    const paginate = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 1800, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchExerciseData = async () => {
            let exercisesData = [];

            if (bodyPart === 'all') {
                exercisesData = await fetchData(
                    'https://exercisedb.p.rapidapi.com/exercises?limit=50',
                    exerciseOptions
                );
            } else {
                exercisesData = await fetchData(
                    `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=50`,
                    exerciseOptions
                );
            }

            setExercises(exercisesData);
        };
        fetchExerciseData();
    }, [bodyPart]);

    return (
        <div id="exercises" className="mt-12 p-5 lg:mt-20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-8">Showing Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {currentEx.map((exercise, index) => (
                    <ExerciseCard key={index} exercise={exercise} />
                ))}
            </div>
            {!isMobile && (
                <div className="mt-10 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Exercises;
