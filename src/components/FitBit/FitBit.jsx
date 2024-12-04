import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';

const clientId = '<YOUR_CLIENT_ID>'; // Replace with your Fitbit app's client ID
const redirectUri = 'http://localhost:3000'; // Replace with your redirect URI
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

            // Store the verifier in session storage for later use
            sessionStorage.setItem('code_verifier', verifier);

            const url = `${fitbitAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}&scope=profile&code_challenge=${challenge}&code_challenge_method=S256`;

            setAuthUrl(url);
            window.location.href = url; // Redirect to Fitbit's authorization page
        } catch (err) {
            setError('Error generating code challenge.');
        }
    };

    const handleTokenExchange = async (code) => {
        try {
            const verifier = sessionStorage.getItem('code_verifier');
            const response = await axios.post(
                'https://api.fitbit.com/oauth2/token',
                new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                    code,
                    code_verifier: verifier,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            setAccessToken(response.data.access_token);
        } catch (err) {
            setError('Error exchanging authorization code for token.');
        }
    };

    const fetchProfileData = async () => {
        if (!accessToken) {
            setError('Access token is missing.');
            return;
        }

        try {
            const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setProfileData(response.data.user);
        } catch (err) {
            setError('Error fetching profile data.');
        }
    };

    // Check for authorization code in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !accessToken) {
        handleTokenExchange(code);
    }

    return (
    
        <Box p={6}>
            <Heading as="h1" size="lg" mb={6}>
                Profile Page
            </Heading>

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}

            {!accessToken && (
                <Button onClick={handleAuthorization} colorScheme="blue">
                    Connect with Fitbit
                </Button>
            )}

            {accessToken && !profileData && (
                <Button onClick={fetchProfileData} colorScheme="green" mt={4}>
                    Fetch Profile Data
                </Button>
            )}

            {profileData && (
                <Box mt={6}>
                    <Text>
                        <strong>Name:</strong> {profileData.fullName}
                    </Text>
                    <Text>
                        <strong>Age:</strong> {profileData.age}
                    </Text>
                    <Text>
                        <strong>Gender:</strong> {profileData.gender}
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default FitBit;
