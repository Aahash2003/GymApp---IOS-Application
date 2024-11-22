import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';


const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [resend, setResend] = useState(false);
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${baseURL}api/auth`;
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            localStorage.setItem("isVerified", res.verified); // Store the verification status
            localStorage.setItem('email', data.email); // Store the email

            if (res.verified === false) {
                setError("Please verify your email to access all features.");
                setResend(true);
            } else {
                window.location = "/";
                navigate("/"); // Redirect to main page if verified
            }
        } catch (error) {
            if (error.response && error.response.status == 400){
                setError("Check Verification Link");
                setResend(false);

            }

            if (error.response && error.response.status > 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setResend(false);
            }
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
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        {resend && (
                            <div className={styles.resend_container}>
                                <button type="button" onClick={handleResendVerification} className={styles.resend_btn}>
                                    Resend Verification Email
                                </button>
                            </div>
                        )}
                        <button type="submit" className={styles.green_btn}>
                            Sign In
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here ?</h1>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
