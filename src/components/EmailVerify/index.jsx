import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import success from "../images/success.png";
import { Fragment } from "react";

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(true);
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                console.log(param.id);
                const url = `${baseURL}api/users/${param.id}/verify/${param.token}`;
                const { data } = await axios.get(url);
                console.log(data);
                setValidUrl(true);

                window.location.href = "https://habits-development.netlify.app/login";
                console.log("Redirect");

            } catch (error) {
                console.log(error.response.data);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param, navigate]);

    return (
        <Fragment>
            {validUrl ? (
                <div className="w-screen h-screen flex items-center justify-center flex-col bg-gray-100">
                    <img src={success} alt="success_img" className="w-32 h-32 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Email verified successfully</h1>
                    <p className="text-gray-600 mt-2">Redirecting to login page...</p>
                    <Link to="/login">
                        <button className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition">Login</button>
                    </Link>
                </div>
            ) : (
                <h1 className="text-4xl font-bold text-red-500 text-center mt-20">404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default EmailVerify;
