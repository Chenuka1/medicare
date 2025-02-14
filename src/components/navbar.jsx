import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { FaCaretDown, FaBars } from 'react-icons/fa';
import image from '../assets/medicare_logo.png';
import '../styles/navbar.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [initials, setInitials] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('Email');

        const Name=localStorage.getItem('Name');
        
        // if (email) {
        //     const extractInitials = (email) => {
        //         const nameParts = email.split('@')[0];
        //         return nameParts[0] + nameParts[1];
        //     };
        //     setInitials(extractInitials(email));
        // }

        if (Name) {
        const extractInitials = (name) => {
            return name.slice(0, 2); // Extracts the first two letters
        };
        setInitials(extractInitials(Name));
    }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('email'); 
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={image} alt="Logo" />
                </div>

                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    <FaBars />
                </div>

                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <li>
                        <ScrollLink to="home-section" smooth={true} duration={500} onClick={toggleMenu}>
                            Home
                        </ScrollLink>
                    </li>
                    <li>
                        <ScrollLink to="services-section" smooth={true} duration={500} onClick={toggleMenu}>
                            Services
                        </ScrollLink>
                    </li>

                    <li>
                        <Link to="/medical-history"> Medical history</Link>
                    </li>
                    {/* <li>
                        <Link to="/register-user">User registration</Link>
                    </li> */}

                </ul>

                <div className="navbar-profile">
                    <div className="profile-initials" onClick={toggleDropdown}>
                        <span>{initials.toUpperCase()}</span>
                        <FaCaretDown
                            size={20}
                            className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                        />
                    </div>


                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}




// import React, { useState } from "react";
// import { Link as ScrollLink } from "react-scroll";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaCaretDown, FaBars } from 'react-icons/fa';
// import image from '../assets/logo_new.png';
// import '../styles/navbar.css';

// export default function Navbar() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const navigate = useNavigate();

//     const toggleMenu = () => {
//         setMenuOpen(!menuOpen);
//     };

//     const toggleDropdown = () => {
//         setIsDropdownOpen(!isDropdownOpen);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('Token');
//         navigate('/');
//     };

//     return (
//         <nav className="navbar">
//             <div className="navbar-container">
//                 {/* Left-aligned logo */}
//                 <div className="navbar-logo">
//                     <img src={image} alt="Logo" />
//                 </div>

//                 {/* Mobile menu icon */}
//                 <div className="mobile-menu-icon" onClick={toggleMenu}>
//                     <FaBars />
//                 </div>

//                 {/* Centered menu items */}
//                 <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
//                     <li>
//                         <ScrollLink to="home-section" smooth={true} duration={500} onClick={toggleMenu}>
//                             Home
//                         </ScrollLink>
//                     </li>
//                     <li>
//                         <ScrollLink to="services-section" smooth={true} duration={500} onClick={toggleMenu}>
//                             Services
//                         </ScrollLink>
//                     </li>
//                     <li>
//                         <Link to="/register-user">User Registration</Link>
//                     </li>
//                     <li>
//                         <Link to="/medical-history">Medical Records</Link>
//                     </li>
//                 </ul>

//                 {/* Right-aligned profile icon */}
//                 <div className="navbar-profile">
//                     <div className="profile-icon" onClick={toggleDropdown}>
//                         <FaUserCircle size={30} />
//                         <FaCaretDown size={20} className="dropdown-icon" />
//                     </div>
//                     {isDropdownOpen && (
//                         <div className="dropdown-menu">
//                             <Link to="/profile">Profile</Link>
//                             <button onClick={handleLogout} className="logout-button">Logout</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// }

