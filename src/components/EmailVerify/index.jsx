import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import success from "../images/success.png";
import styles from "./styles.module.css";
import { Fragment } from "react";


const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();
	const navigate = useNavigate(); // Initialize useNavigate

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				console.log(param.id);
				const url = `${baseURL}api/users/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);

				window.location.href = "https://habits-development.netlify.app/login";
				console.log("Redirect")


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
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<h1>Email verified successfully</h1>
					<p>Redirecting to login page...</p>
					{/* Optionally keep the login button as a manual alternative */}
					<Link to="/login">
						<button className={styles.green_btn}>Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
	);
};

export default EmailVerify;