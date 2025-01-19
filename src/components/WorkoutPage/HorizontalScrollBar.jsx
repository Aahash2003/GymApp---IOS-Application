import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import LeftArrowIcon from './left-arrow.png';
import RightArrowIcon from './right-arrow.png';

const LeftArrow = () => {
    const { scrollPrev } = React.useContext(VisibilityContext);

    return (
        <button
            onClick={() => scrollPrev()}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex justify-center items-center"
        >
            <img src={LeftArrowIcon} alt="left-arrow" className="w-full h-full" />
        </button>
    );
};

const RightArrow = () => {
    const { scrollNext } = React.useContext(VisibilityContext);

    return (
        <button
            onClick={() => scrollNext()}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex justify-center items-center"
        >
            <img src={RightArrowIcon} alt="right-arrow" className="w-full h-full" />
        </button>
    );
};

const HorizontalScrollbar = ({ categories, handleCategoryChange, selectedCategory, handleDeleteCategory }) => (
    <div className="relative px-16">
        <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
            {categories.map((category) => (
                <div
                    key={category._id}
                    itemId={category._id}
                    className={`flex flex-col items-center justify-center cursor-pointer border ${selectedCategory === category._id ? 'border-red-500' : 'border-transparent'} rounded-lg w-64 h-80 bg-white shadow-lg mx-4 transition-transform transform hover:scale-105 p-4`}
                    onClick={() => handleCategoryChange(category._id)}
                >
                    <img src={category.imageUrl} alt={category.name} className="w-24 h-24" />
                    <p className="text-lg font-bold text-gray-800 capitalize mt-2">{category.name}</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category._id);
                        }}
                        className="mt-4 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 text-sm"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </ScrollMenu>
    </div>
);

export default HorizontalScrollbar;
