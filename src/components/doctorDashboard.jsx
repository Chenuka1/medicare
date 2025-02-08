import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/doctorDashboard.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/medicare_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faHistory, faPills, faCalendarAlt, faClock, faUserMd, faClinicMedical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaCaretDown, FaBars } from 'react-icons/fa';
export default function Doctordashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem('Role');
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
        setShowMobileMenu(!showMobileMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/admin');
    };

    const closeSidebar = () => {
        setShowMobileMenu(false);
    };

    return (
        <div className={`doctorDashboard ${isOpen ? 'open' : 'closed'}`}>
            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${showMobileMenu ? 'show-mobile' : ''}`}>
                <div className="logo">
                    <img src={logo} alt="Doctor Dashboard Logo" />
                    {/* Close button for mobile view */}
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="close-icon"
                        onClick={closeSidebar}
                    />
                </div>
                <ul className="menu">
                    {['Doc', 'Admin'].includes(role) && (
                        <li>
                            <NavLink
                                to="/dashboard/medical-history"
                                className={({ isActive }) =>
                                    isActive ? "active-tab" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <FontAwesomeIcon icon={faHistory} /> {isOpen && 'Medical History'}
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink
                            to="register-medicines"
                            className={({ isActive }) =>
                                isActive ? "active-tab" : ""
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faPills} /> {isOpen && 'Drug details'}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="pharmacy"
                            className={({ isActive }) =>
                                isActive ? "active-tab" : ""
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faClinicMedical} /> {isOpen && 'Pharmacy'}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="doctor-profile"
                            className={({ isActive }) =>
                                isActive ? "active-tab" : ""
                            }
                            onClick={closeSidebar}
                        >
                            <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'User Profile'}
                        </NavLink>
                    </li>
                    {(role === 'Doc' || role === 'Admin') && (
                        <li>
                            <NavLink
                                to="daily-appointments"
                                className={({ isActive }) =>
                                    isActive ? "active-tab" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} /> {isOpen && 'Appointments'}
                            </NavLink>
                        </li>
                    )}

                    {role === 'Admin' && (
                        <li>
                            <NavLink
                                to="add-timeslot"
                                className={({ isActive }) =>
                                    isActive ? "active-tab" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <FontAwesomeIcon icon={faClock} /> {isOpen && 'Add Timeslots'}
                            </NavLink>
                        </li>
                    )}
                    {role === 'Admin' && (
                        <li>
                            <NavLink
                                to="add-users"
                                className={({ isActive }) =>
                                    isActive ? "active-tab" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <FontAwesomeIcon icon={faUserMd} /> {isOpen && 'Add Users'}
                            </NavLink>
                        </li>
                    )}
                </ul>


                <ul className="below">

                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={`main-content1 ${isOpen && window.innerWidth <= 600 ? 'hide-content' : ''}`}>
                <FontAwesomeIcon
                    icon={faBars}
                    className="menu-icon"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                />
                <Outlet />
            </div>
        </div>
    );
}
