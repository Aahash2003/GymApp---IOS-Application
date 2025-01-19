import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${baseURL}api/users`;
            const { data: res } = await axios.post(url, data);
            setMsg(res.message);
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
            <div className="w-[900px] h-auto flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden">
                <div
                    className="flex-1 flex flex-col items-center justify-center bg-teal-600 text-white p-8 w-full md:w-auto order-2 md:order-1">
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

                <div
                    className="flex-2 flex flex-col items-center justify-center bg-white p-8 w-full md:w-auto order-1 md:order-2">
                    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
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
                        {error && (
                            <div
                                className="w-full p-4 mb-4 text-sm bg-red-500 text-white text-center rounded">{error}</div>
                        )}
                        {msg && (
                            <div
                                className="w-full p-4 mb-4 text-sm bg-teal-600 text-white text-center rounded">{msg}</div>
                        )}
                        <button type="submit"
                                className="px-4 py-2 bg-teal-600 rounded-2xl text-white w-[180px] font-bold text-sm">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
