import React from 'react';
import Icon from '../Assets/Icon/Equipment Sign.png';

const BodyPart = ({ item, setBodyPart, bodyPart }) => (
    <button
        className={`flex flex-col items-center justify-center rounded-bl-lg cursor-pointer gap-6 
      ${bodyPart === item ? 'border-t-4 border-red-500' : ''} 
      bg-white 
      w-48 h-56 sm:w-64 sm:h-72`}
        onClick={() => {
            setBodyPart(item);
            window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
        }}
    >
        <img src={Icon} alt="dumbbell" className="w-8 h-8 sm:w-10 sm:h-10" />
        <p className="text-lg font-bold font-serif text-gray-800 capitalize sm:text-lg">{item}</p>
    </button>
);

export default BodyPart;
