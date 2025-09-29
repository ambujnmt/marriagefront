import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    BiCalendarEvent,
    BiMessageSquareDetail,
    BiChart,
    BiArchive,
    BiSolidMegaphone,
    BiFile,
    BiCog,
    BiChevronRight
} from 'react-icons/bi';
import { AiOutlineLogout } from 'react-icons/ai';

import defaultUser from '../../assets/images/logoapp.png';

const Sidebar = ({ isVisible, handleLogout }) => {
    const handleLogoutClick = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to logout!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout(); // 🔄 Call parent logout
            }
        });
    };

    return (
        <div className={`sidebar ${isVisible ? 'show' : 'hide'}`}>
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="logo-main">
                    <h3>Marriage App</h3>
                    {/* <img
                        src="/assets/images/logoapp.png"
                        alt="Logo"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultUser;
                        }}
                        style={{ width: '150px', height: 'auto' }}
                    /> */}

                </div>
            </div>

            {/* Navigation Links */}
            <ul>
                <li>
                    <Link to="/dashboard">
                        Dashboard <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/partner-list">
                        <BiCalendarEvent />Users List<BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/daily-check-in">
                        <BiCalendarEvent /> Daily Check in Ques.<BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/dealy-check-in-answer">
                        <BiMessageSquareDetail />DailyCheckin Ans.<BiChevronRight className="arrow-icon" />
                    </Link>
                </li>

                <li>
                    <Link to="/weakly-check-in">
                        <BiMessageSquareDetail /> Weekly Qestion<BiChevronRight className="arrow-icon" />
                    </Link>
                </li>

                <li>
                    <Link to="/performance">
                        <BiChart /> Result & Analytics <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/offers">
                        <BiArchive /> Leaderboard & Gamification <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/marketing">
                        <BiSolidMegaphone /> Relationship progress streaks <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/documents">
                        <BiFile /> Recommendations Engine <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/settings/profile">
                        <BiCog /> Profile <BiChevronRight className="arrow-icon" />
                    </Link>
                </li>
                <li>
                    <button className="logout-btn" onClick={handleLogoutClick}>
                        <AiOutlineLogout className="icon" />
                        <span className="logoutspan">Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
