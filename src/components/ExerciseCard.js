import React from 'react'
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
                className="w-full h-auto"
            />
            <div className="flex flex-row p-5">
                <button className="ml-5 bg-[#ffa9a9] text-white text-sm font-medium rounded-full px-4 py-1 capitalize">
                    {exercise.bodyPart}
                </button>
                <button className="ml-5 bg-[#fcc757] text-white text-sm font-medium rounded-full px-4 py-1 capitalize">
                    {exercise.target}
                </button>
            </div>
            <h3 className="ml-5 mt-3 font-bold italic text-[22px] text-black capitalize pb-2">
                {exercise.name}
            </h3>
        </Link>
    );

}

export default ExerciseCard