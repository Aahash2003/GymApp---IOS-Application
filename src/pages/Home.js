import React, {useState} from 'react';
import Exercises from '../components/Exercises';
import HeroBanner from '../components/HeroBanner';
import SearchExercises from '../components/SearchExercises';

const Home = () => {
    const [bodyPart, setBodyPart] = useState('all');
    const [exercises, setExercises] = useState([]);

    return (
        <div>
            <HeroBanner/>
            <SearchExercises
                setExercises={setExercises}
                bodyPart={bodyPart}
                setBodyPart={setBodyPart}
            />
            <Exercises
                exercises={exercises}
                setExercises={setExercises}
                bodyPart={bodyPart}
            />
        </div>
    )
}

export default Home