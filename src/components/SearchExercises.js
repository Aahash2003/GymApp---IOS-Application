import React, { useEffect, useState } from 'react';
import { fetchAllExercises, fetchData, exerciseOptions } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

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
        <div className="flex flex-col items-center w-full mt-9 p-5">
            <div className="text-4xl font-bold mb-8 text-center">
                Great Exercises You<br />Should Learn
            </div>
            <div className="flex items-center relative mb-18 sm:mb-8 w-full">
                <textarea
                    className="font-bold border border-gray-300 w-[1000px] bg-white rounded-full h-8 ml-2 resize-none py-1 px-2 sm:w-full sm:h-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Search Exercises"
                />
                <button
                    className="bg-red-600 text-white capitalize w-44 h-9 ml-4 rounded-lg text-semibold"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            <div className="relative w-full p-5">
                <HorizontalScrollbar
                    data={bodyParts}
                    bodyPart={bodyPart}
                    setBodyPart={setBodyPart}
                    isBodyParts
                />
            </div>
        </div>
    );

};

export default SearchExercises;
