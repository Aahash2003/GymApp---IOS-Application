import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Heading,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';


const Profile = () => {
    const [formData, setFormData] = useState({
        dob: '',  // Changed from age to dob
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
        setFormData({ email, ...formData, [e.target.name]: e.target.value });
    };

    const calculateAge = (dob) => {
        return dayjs().diff(dob, 'year');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format the dob to remove the time part
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
        <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
            <Heading as="h1" size="lg" mb={6}>
                Profile Page
            </Heading>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            name="email"
                            value={email}
                            isReadOnly
                        />
                    </FormControl>
                    <FormControl id="dob" isRequired>
                        <FormLabel>Date of Birth</FormLabel>
                        <Input
                            type="date"
                            name="dob"
                            value={dob}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="gender" isRequired>
                        <FormLabel>Gender</FormLabel>
                        <Select
                            name="gender"
                            value={gender}
                            onChange={handleChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Select>
                    </FormControl>
                    <FormControl id="height" isRequired>
                        <FormLabel>Height (cm)</FormLabel>
                        <Input
                            type="number"
                            name="height"
                            value={height}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="currentWeight" isRequired>
                        <FormLabel>Current Weight (kg)</FormLabel>
                        <Input
                            type="number"
                            name="currentWeight"
                            value={currentWeight}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="activityLevel" isRequired>
                        <FormLabel>Activity Level</FormLabel>
                        <Select
                            name="activityLevel"
                            value={activityLevel}
                            onChange={handleChange}
                        >
                            <option value="Sedentary">Sedentary</option>
                            <option value="Lightly Active">Lightly Active</option>
                            <option value="Moderately Active">Moderately Active</option>
                            <option value="Very Active">Very Active</option>
                            <option value="Super Active">Super Active</option>
                        </Select>
                    </FormControl>
                    <Button colorScheme="blue" type="submit">
                        Save Profile
                    </Button>
                </Stack>
            </form>
            {profile && (
                <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
                    <Text><strong>Email:</strong> {profile.email}</Text>
                    <Text><strong>Date of Birth:</strong> {profile.DOB.split('T')[0]}</Text>
                    <Text><strong>Age:</strong> {calculateAge(profile.DOB)}</Text>
                    <Text><strong>Gender:</strong> {profile.Gender}</Text>
                    <Text><strong>Height:</strong> {profile.Height} cm</Text>
                    <Text><strong>Current Weight:</strong> {profile.CurrentWeight} kg</Text>
                    <Text><strong>Activity Level:</strong> {profile.ActivityLevel}</Text>
                </Box>
            )}
            <Button colorScheme="green" mt={4} onClick={handleGetProfile}>
                Get Profile
            </Button>
        </Box>
    );
};

export default Profile;
