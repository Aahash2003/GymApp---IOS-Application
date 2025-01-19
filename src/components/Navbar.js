import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Assets/Logo/Logo3.png';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("isVerified");
            localStorage.removeItem("isAdmin");
            setIsAuthenticated(false);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <div className="flex justify-between items-center px-5 py-5 bg-white border-b">
            <div className="hidden md:block">
                <Link to="/">
                    <img src={Logo} alt="logo" className="w-12 h-12" />
                </Link>
            </div>
            <button
                className="text-gray-800 md:hidden focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                </svg>
            </button>
            <div
                className={`${
                    menuOpen ? 'block' : 'hidden'
                } md:flex md:items-center md:space-x-8 md:text-2xl`}
            >
                <Link to="/home" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>Home</Link>
                <Link to="/calc" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>Caloric Calculator</Link>
                <Link to="/workout" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>Workout Log</Link>
                <Link to="/Calories" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>Caloric Counter</Link>
                <Link to="/profile" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>Profile</Link>
                <Link to="/AI" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>AI</Link>
                <Link to="/FitBit" className="text-gray-800 hover:underline py-2 block" onClick={handleLinkClick}>FitBit</Link>
            </div>
            <div>
                {isAuthenticated ? (
                    <button
                        className={`bg-white border border-gray-300 rounded-full px-6 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 focus:outline-none ${isLoading ? 'cursor-not-allowed bg-gray-200' : ''}`}
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging Out...' : 'Logout'}
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="bg-white border border-gray-300 rounded-full px-6 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
