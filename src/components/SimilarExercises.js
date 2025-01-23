import React from 'react';
import HorizontalScrollbar from "./HorizontalScrollbar";
import Loader from './Loader';

const SimilarExercises = ({targetMuscleExercises, equipmentExercises}) => {
    return (
        <div className="mt-24 lg:mt-10">
            <h1 className="text-3xl capitalize mb-5">
                Exercises that target the same muscle group
            </h1>
            <div className="flex p-2 relative">
                {targetMuscleExercises.length !== 0 ? (
                    <HorizontalScrollbar data={targetMuscleExercises}/>
                ) : (
                    <Loader/>
                )}
            </div>

            <h1 className="text-3xl capitalize mb-5 mt-10">
                Exercises that use the same equipment
            </h1>
            <div className="flex p-2 relative">
                {equipmentExercises.length !== 0 ? (
                    <HorizontalScrollbar data={equipmentExercises}/>
                ) : (
                    <Loader/>
                )}
            </div>
        </div>
    );
};

export default SimilarExercises;
