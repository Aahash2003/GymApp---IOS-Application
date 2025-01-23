import React, { useState } from 'react';

const ExerciseVideos = ({ exerciseVideos, name }) => {
    const [currentVideo, setCurrentVideo] = useState(null);

    if (!exerciseVideos.length) return 'Loading...';

    const handleVideoClick = (videoId) => {
        setCurrentVideo(`https://www.youtube.com/embed/${videoId}`);
    };

    return (
        <div className="mt-5 lg:mt-48 p-5">
            <h1 className="text-xl mb-8 sm:text-3xl">
                Watch <span className="text-red-600 capitalize">{name}</span> exercise videos
            </h1>

            <div className="flex flex-wrap justify-start items-center gap-28 lg:gap-28">
                {exerciseVideos?.slice(0, 3).map((item, index) => (
                    <div key={index} className="exercise-video cursor-pointer" onClick={() => handleVideoClick(item.video.videoId)}>
                        <img src={item.video.thumbnails[0].url} alt={item.video.title} className="mb-3" />
                        <div>
                            <h2 className="text-xl text-gray-800 font-semibold">
                                {item.video.title}
                            </h2>
                            <h3 className="text-lg text-gray-900">
                                {item.video.channelName}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {currentVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="relative w-full max-w-2xl p-5">
                        <iframe
                            src={currentVideo}
                            title="Exercise Video"
                            className="w-full h-80 sm:h-[500px]"
                            allowFullScreen
                        ></iframe>
                        <button
                            onClick={() => setCurrentVideo(null)}
                            className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded-full hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseVideos;
