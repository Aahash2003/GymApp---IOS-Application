import React from 'react';
import BodyPartImage from '../Assets/Icon/body-part.png';
import TargetImage from '../Assets/Icon/target.png';
import EquipmentImage from '../Assets/Icon/equipment.png';

const Detail = ({ exerciseDetail }) => {
    const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;

    const extraDetail = [
        {
            icon: BodyPartImage,
            name: bodyPart,
        },
        {
            icon: TargetImage,
            name: target,
        },
        {
            icon: EquipmentImage,
            name: equipment,
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-16 p-5 items-center">
            <img src={gifUrl} alt={name} loading="lazy" className="w-full lg:w-1/2 object-cover" />
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl font-bold capitalize">{name}</h1>
                <p className="text-lg leading-relaxed">
                    Exercises keep you fit. <span className="capitalize">{name}</span> is one of the best
                    exercises to target your {target}. It will help you improve your mood and gain energy.
                </p>
                {extraDetail.map((item) => (
                    <div key={item.name} className="flex items-center gap-6">
                        <div className="bg-[#fff2db] rounded-full w-24 h-24 flex justify-center items-center">
                            <img src={item.icon} alt={item.name} className="w-12 h-12" />
                        </div>
                        <h2 className="text-xl capitalize font-medium">{item.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Detail;
