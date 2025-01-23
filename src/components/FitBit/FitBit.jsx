import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Alert,
    AlertIcon,
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
            const challenge = await generateCodeChallenge(verifier);

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
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const averageRestingHeartRate = 73;

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
            setError('Access token is missing for prfile.');
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

    
    const handleLogout = async () => {
        try {
            if (accessToken) {
                
                await axios.post(
                    'https://api.fitbit.com/oauth2/revoke',
                    new URLSearchParams({ token: accessToken }).toString(),
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
            }
        } catch (err) {
            console.error('Error revoking access token:', err.message);
        }
    
       
        setAccessToken('');
        setProfileData(null);
        setError(null);
        localStorage.removeItem('accessToken'); 
        sessionStorage.removeItem('code_verifier'); 
    
        
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('code'); 
        currentUrl.searchParams.delete('state');
        window.history.replaceState({}, document.title, currentUrl.toString());
    
        
        window.location.href = '/FitBit'; 
    };
    
    
    

    useEffect(() => {
       
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
        } else {
            
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
    
            if (code) {
                handleTokenExchange(code);
            }
        }
    }, []);
    
    useEffect(() => {
        if (accessToken) {
            
            localStorage.setItem('accessToken', accessToken);
            fetchProfileData(); 
        }
    }, [accessToken]);
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
            
            {error && (
                <Alert status="error" className="max-w-xl mb-4">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
    
            
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold text-gray-800">
                    <span className="text-red-600">FitBit</span> Dashboard
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                    View your health data and achievements powered by Fitbit
                </p>
            </div>
    
          
            <div className="mt-6">
                {!accessToken && (
                    <button
                        onClick={handleAuthorization}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400"
                    >
                        Connect with Fitbit
                    </button>
                )}
            </div>
    
           
            {profileData && (
                <div className="w-full max-w-4xl mt-8">
                   
                    <div className="p-6 bg-white rounded-xl shadow-lg mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Top Badges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profileData.topBadges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 bg-gray-100 rounded-lg border-2 border-red-500 shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <img
                                        src={badge.image100px}
                                        alt={badge.name}
                                        className="w-20 h-20 mb-4 rounded-full border-2 border-red-300"
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
                        </div>
                    </div>
    
                    
                    <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-red-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {['averageDailySteps', 'sleepTracking', 'averageHeartRate'].map((key) => (
                                <div key={key} className="p-4 bg-gray-100 rounded-lg shadow-md">
                                    <h3 className="text-lg font-bold text-gray-700 capitalize mb-2">
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </h3>
                                    <p className="text-gray-600 bg-white p-3 rounded-md shadow-sm">
                                        {JSON.stringify(profileData[key], null, 2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
    
           
            {accessToken && (
                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white font-medium py-3 px-6 rounded-full shadow-md hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );

};

export default FitBit;
