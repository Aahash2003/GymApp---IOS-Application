import React from 'react';
import { Link } from 'react-router-dom';

const ExerciseCard = ({ exercise }) => {
    return (
        <Link
            to={`/exercise/${exercise.id}`}
            className="block bg-white shadow-md rounded-lg overflow-hidden transform transition hover:scale-105"
        >
            <img
                src={exercise.gifUrl}
                alt={exercise.name}
                loading="lazy"
                className="w-full h-48 object-cover"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4">
                <button className="bg-[#ffa9a9] text-white text-xs font-medium rounded-full px-3 py-1 capitalize">
                    {exercise.bodyPart}
                </button>
                <button className="bg-[#fcc757] text-white text-xs font-medium rounded-full px-3 py-1 capitalize">
                    {exercise.target}
                </button>
            </div>
            <h3 className="p-4 text-base font-bold italic text-gray-800 capitalize leading-tight">
                {exercise.name}
            </h3>
        </Link>
    );
};

export default ExerciseCard;
