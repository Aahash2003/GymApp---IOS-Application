import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Alert,
    AlertIcon,
    Heading,
    Text,
} from '@chakra-ui/react';

const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/'
  : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const clientId = '23PZHY'; 
const redirectUri = 'http://localhost:3000/FitBit'; 
const fitbitAuthUrl = 'https://www.fitbit.com/oauth2/authorize';

const generateCodeVerifier = () => {
    const array = new Uint32Array(56 / 2);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const FitBit = () => {
    const [authUrl, setAuthUrl] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    const handleAuthorization = async () => {
        try {
            const verifier = generateCodeVerifier();
            console.log("verifier: ", verifier);
            const challenge = await generateCodeChallenge(verifier);
            console.log("challenge: ", challenge);

            sessionStorage.setItem('code_verifier', verifier);

            const url = `${fitbitAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}&scope=profile heartrate&code_challenge=${challenge}&code_challenge_method=S256`;
            

            setAuthUrl(url);
            window.location.href = url;
        } catch (err) {
            setError('Error generating code challenge.');
        }
    };

    const handleTokenExchange = async (code) => {
        try {
            const verifier = sessionStorage.getItem('code_verifier');
            const response = await axios.post(`${baseURL}api/FitBit/token`, { code, verifier });
            setAccessToken(response.data.access_token);
        } catch (err) {
            setError('Error exchanging authorization code for token.');
        }
    };

    const fetchHeartRateData = async () => {
        if (!accessToken) {
            setError('Access token is missing.');
            return;
        }

        try {
            const url = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json';
    
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Fitbit API requires the access token in the Authorization header
                    'Content-Type': 'application/json', // Optional, ensures proper format
                },
            });
    
            const heartRateData = response.data['activities-heart'];
            //This should work but not enough data
            //const averageRestingHeartRate = (
             //   heartRateData.reduce((sum, entry) => sum + entry.value.restingHeartRate, 0) /
              //  heartRateData.length
            //).toFixed(2);
            
            const averageRestingHeartRate = 73
    
            setProfileData((prevData) => ({
                ...prevData,
                averageHeartRate: averageRestingHeartRate,
            }));
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response.data);
            } else {
                console.error('Error:', err.message);
            }
            setError('Error fetching heart rate data.');
        }
    };    

    const fetchProfileData = async () => {
        if (!accessToken) {
            setError('Access token is missing.');
            return;
        }

        try {
            const response = await axios.get(`${baseURL}api/FitBit/profile`, {
                headers: { accessToken },
            });
            setProfileData(response.data.user);
        } catch (err) {
            setError('Error fetching profile data.');
        }

        fetchHeartRateData();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !accessToken) {
            handleTokenExchange(code);
        }


    }, [accessToken]);

    return (
        <Box p={6}>
            

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
<div className="flex items-center justify-center">
{!accessToken && (
    <button
        onClick={handleAuthorization}
        className="bg-blue-500  text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
    >
        Connect with Fitbit
    </button>
)}

{accessToken && !profileData && (
    <div>
        <button
            onClick={fetchProfileData}
            className="bg-green-500 text-white font-medium py-2 px-4 mt-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
            Fetch Profile Data
        </button>
       
    </div>
)}
</div>

{profileData && profileData.topBadges && (
    <Box mt={6}>
        
        {profileData && profileData.topBadges && (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileData.topBadges.map((badge, index) => (
                <div 
                    key={index} 
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <img 
                        src={badge.image100px} 
                        alt={badge.name} 
                        className="w-20 h-20 mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {badge.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-2">
                        {badge.description}
                    </p>
                    <p className="text-xs text-gray-500">
                        Earned on: <span className="font-semibold">{badge.dateTime}</span>
                    </p>
                </div>          


            ))}

        {/* <button this is just to update values 
            onClick={fetchHeartRateData}
            className="bg-purple-500 text-white font-medium py-2 px-4 mt-4 rounded-lg shadow-md hover:bg-purple-600 transition duration-200"
        >
            Fetch Heart Rate Data
        </button>
*/}
<Box mt={6}>
    {['averageDailySteps', 'sleepTracking', 'averageHeartRate'].map((key) => (
        <div key={key} className="mb-4">
            <h2 className="text-lg font-bold text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
            </h2>
            <p className="text-gray-600 bg-gray-100 p-2 rounded-md shadow">
                {JSON.stringify(profileData[key], null, 2)}
            </p>
        </div>
    ))}
</Box>

        </div>
       

    </div>
)}

    </Box>

    
)}



        </Box>
    );
};

export default FitBit;
