import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [resend, setResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = `${baseURL}api/auth`;
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            localStorage.setItem("isVerified", res.verified);
            localStorage.setItem('email', data.email);

            if (res.verified === false) {
                setError("Please verify your email to access all features.");
                setResend(true);
            } else {
                window.location = "/";
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("Check Verification Link");
                setResend(false);
            }

            if (error.response && error.response.status > 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setResend(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            const { email } = data;
            await axios.post(`${baseURL}api/auth/resend-verification`, { email });
            setError("Verification email resent. Please check your inbox.");
            setResend(false);
        } catch (error) {
            setError("Error resending verification email.");
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
            <div className="w-[900px] h-auto md:h-[500px] flex flex-col md:flex-row shadow-md rounded-lg overflow-hidden">
                <div className="flex-2 flex flex-col items-center justify-center bg-white p-8 w-full md:w-auto">
                    <form
                        className="flex flex-col items-center w-full"
                        onSubmit={handleSubmit}
                        style={{ minHeight: "300px" }}
                    >
                        <h1 className="text-3xl md:text-4xl mb-6">Login to Your Account</h1>
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
                            <div className="w-full p-4 mb-4 text-sm bg-red-500 text-white text-center rounded">
                                {error}
                            </div>
                        )}
                        {resend && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Resend Verification Email
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`px-4 py-2 mt-6 rounded-2xl w-[180px] font-bold text-sm ${
                                isLoading ? "bg-gray-500" : "bg-teal-600 text-white"
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Sign In"}
                        </button>
                    </form>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-teal-600 rounded-2xl text-white p-8 w-full md:w-auto">
                    <h1 className="text-3xl md:text-4xl mb-4">New Here ?</h1>
                    <Link to="/signup">
                        <button
                            type="button"
                            className="px-4 py-2 bg-white rounded-2xl text-black w-[180px] font-bold text-sm"
                        >
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );

};

export default Login;
