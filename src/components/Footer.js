import React from 'react';
import Logo from '../Assets/Logo/Logo.png';

const Footer = () => {
    return (
        <div className="footer-container text-center py-6">
            <div className="flex flex-col items-center gap-10 px-4 pt-6">
                <img src={Logo} alt="logo" className="w-[800px] h-[80px] md:h-[160px]"  />
            </div>
        </div>
    );
};

export default Footer;
