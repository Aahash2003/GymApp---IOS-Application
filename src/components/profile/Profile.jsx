import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const Profile = () => {
    const [formData, setFormData] = useState({
        dob: '',
        gender: 'Male',
        height: '',
        currentWeight: '',
        activityLevel: 'Moderately Active',
    });
    const email = localStorage.getItem('email');
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    const { dob, gender, height, currentWeight, activityLevel } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateAge = (dob) => {
        return dayjs().diff(dob, 'year');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedDOB = dayjs(dob).format('YYYY-MM-DD');

            const res = await axios.post(`${baseURL}api/profile/`, { ...formData, dob: formattedDOB, email });
            setProfile(res.data.profile);
            setError('');
        } catch (err) {
            setError('Error saving profile. Please try again.');
        }
    };

    const handleGetProfile = async () => {
        try {
            const res = await axios.get(`${baseURL}api/profile/${email}`);
            setProfile(res.data);
            setError('');
        } catch (err) {
            setError('Profile not found. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg">
            <h1 className="text-xl font-bold mb-6">Profile Page</h1>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-2">Email</label>
                    <input
                        name="email"
                        value={email}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={dob}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Gender</label>
                    <select
                        name="gender"
                        value={gender}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium mb-2">Height (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={height}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Current Weight (kg)</label>
                    <input
                        type="number"
                        name="currentWeight"
                        value={currentWeight}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Activity Level</label>
                    <select
                        name="activityLevel"
                        value={activityLevel}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly Active">Lightly Active</option>
                        <option value="Moderately Active">Moderately Active</option>
                        <option value="Very Active">Very Active</option>
                        <option value="Super Active">Super Active</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Save Profile
                </button>
            </form>
            {profile && (
                <div className="mt-6 p-4 border rounded">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Date of Birth:</strong> {profile.DOB.split('T')[0]}</p>
                    <p><strong>Age:</strong> {calculateAge(profile.DOB)}</p>
                    <p><strong>Gender:</strong> {profile.Gender}</p>
                    <p><strong>Height:</strong> {profile.Height} cm</p>
                    <p><strong>Current Weight:</strong> {profile.CurrentWeight} kg</p>
                    <p><strong>Activity Level:</strong> {profile.ActivityLevel}</p>
                </div>
            )}
            <button
                onClick={handleGetProfile}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-4"
            >
                Get Profile
            </button>
        </div>
    );
};

export default Profile;
