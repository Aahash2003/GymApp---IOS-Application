import React from 'react'
const HeroBanner = () => {
    return (
        <div className="relative mt-[70px] p-5 lg:mt-[212px] sm:ml-[50px]">
            <h1 className="text-[#FF2625] font-semibold text-[26px]">
                Fitness Club
            </h1>
            <h2 className="font-bold mt-5 mb-4 text-[40px] lg:text-[44px]">
                Sleep <br />
                Grind <br />
                Repeat
            </h2>
            <p className="text-[22px] leading-[35px] mb-2">
                Check out the Most Effective Workouts
            </p>
            <a
                href="#exercises"
                className="inline-block bg-[#ff2625] text-white py-2 px-4 rounded hover:bg-[#e52422] transition"
            >
                Explore Exercises
            </a>
            <h1 className="font-bold text-[200px] text-[#ff2625] opacity-10 hidden lg:block">
                Exercises
            </h1>
        </div>
    );
}

export default HeroBanner