import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        nickName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [passwordValidations, setPasswordValidations] = useState({
        hasUpperCase: false,
        hasSpecialChar: false,
        hasMinLength: false,
        hasNumber: false,
    });

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });

        if (input.name === "password") {
            validatePassword(input.value);
        }
    };

    const validatePassword = (password) => {
        setPasswordValidations({
            hasUpperCase: /[A-Z]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasMinLength: password.length >= 6,
            hasNumber: /\d/.test(password),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { hasUpperCase, hasSpecialChar, hasMinLength, hasNumber } = passwordValidations;
        if (!hasUpperCase || !hasSpecialChar || !hasMinLength || !hasNumber) {
            setError("Password does not meet the requirements.");
            return;
        }

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const url = `${baseURL}api/users`;
            const { data: res } = await axios.post(url, data);
            setMsg(res.message);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError("Username already exists.");
            } else if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
            <div className="w-[900px] h-auto flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden relative">
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-teal-600 text-white p-8">
                    <h1 className="text-3xl md:text-4xl mb-4">Welcome Back</h1>
                    <Link to="/login">
                        <button
                            type="button"
                            className="px-4 py-2 bg-white rounded-2xl text-black w-[180px] font-bold text-sm"
                        >
                            Sign In
                        </button>
                    </Link>
                </div>

                <div className="flex-2 flex flex-col items-center justify-center bg-white px-8 mb-6 w-full md:w-auto">
                    <form
                        className="flex flex-col items-center w-full relative"
                        onSubmit={handleSubmit}
                    >
                        <h1 className="text-3xl md:text-4xl mb-6">Create Account</h1>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Nickname"
                            name="nickName"
                            onChange={handleChange}
                            value={data.nickName}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleChange}
                            value={data.confirmPassword}
                            required
                            className="w-full p-4 rounded-lg bg-gray-200 mb-4 text-sm"
                        />
                        <ul className="w-full text-sm mb-4">
                            <li className="flex items-center">
                                {passwordValidations.hasUpperCase ? (
                                    <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                    <FaTimes className="text-red-500 mr-2" />
                                )}
                                One capital letter
                            </li>
                            <li className="flex items-center">
                                {passwordValidations.hasSpecialChar ? (
                                    <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                    <FaTimes className="text-red-500 mr-2" />
                                )}
                                One special character
                            </li>
                            <li className="flex items-center">
                                {passwordValidations.hasMinLength ? (
                                    <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                    <FaTimes className="text-red-500 mr-2" />
                                )}
                                At least 6 characters long
                            </li>
                            <li className="flex items-center">
                                {passwordValidations.hasNumber ? (
                                    <FaCheck className="text-green-500 mr-2" />
                                ) : (
                                    <FaTimes className="text-red-500 mr-2" />
                                )}
                                At least one number
                            </li>
                        </ul>
                        {error && (
                            <div className="w-full p-4 mb-4 text-sm bg-red-500 text-white text-center rounded">
                                {error}
                            </div>
                        )}
                        {msg && (
                            <div className="w-full p-4 mb-4 text-sm bg-teal-600 text-white text-center rounded">
                                {msg}
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-2xl w-[180px] font-bold text-sm ${
                                isLoading ? "bg-gray-500" : "bg-teal-600 text-white"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                    </form>
                </div>

                <div className="block md:hidden w-full flex flex-col items-center rounded-2xl justify-center bg-teal-600 text-white p-8">
                    <h1 className="text-3xl mb-4">Welcome Back</h1>
                    <Link to="/login">
                        <button
                            type="button"
                            className="px-4 py-2 bg-white rounded-2xl text-black w-[180px] font-bold text-sm"
                        >
                            Sign In
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );


};

export default Signup;
