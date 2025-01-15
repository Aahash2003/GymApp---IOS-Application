import React, { useRef } from 'react';
import LeftArrowIcon from '../Assets/Icon/left-arrow.png';
import RightArrowIcon from '../Assets/Icon/right-arrow.png';
import ExerciseCard from './ExerciseCard';
import BodyPart from './BodyPart';

const HorizontalScrollbar = ({ data, setBodyPart, bodyPart, isBodyParts }) => {
  const scrollContainerRef = useRef(null);
  const cardWidth = 200;
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      });
    }
  };

    return (
        <div className="relative w-full">
            <div className="flex justify-between items-center mb-4">
                <div
                    className="cursor-pointer"
                    onClick={scrollLeft}
                >
                    <img src={LeftArrowIcon} alt="left-arrow" className="w-8 h-8" />
                </div>
                <div
                    className="cursor-pointer"
                    onClick={scrollRight}
                >
                    <img src={RightArrowIcon} alt="right-arrow" className="w-8 h-8" />
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-smooth whitespace-nowrap no-scrollbar"
            >
                {data.map((item) => (
                    <div
                        key={item.id || item}
                        className="inline-block"
                        style={{ width: '200px' }}
                    >
                        {isBodyParts ? (
                            <BodyPart item={item} setBodyPart={setBodyPart} bodyPart={bodyPart} />
                        ) : (
                            <ExerciseCard exercise={item} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalScrollbar;
