// Header.js
import React, { useEffect, useState } from 'react';

const Header = ({ toggleSidebar, sidebarVisible }) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {

        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    return (
        <header className={`header ${sidebarVisible ? '' : 'full-width'}`}>

            <div className="menu-icon" onClick={toggleSidebar}></div>

            <div className="header-right">
                <div className="notification-wrapper">
                    <div className="notification-icon">🔔</div>
                    <div className="notification-badge">8</div>
                </div>
                <div className="user-info">
                    <div className="profile-img">👤</div>
                    <div className="user-details">
                        <div className="user-name">{userName}</div>
                        <div className="user-role">Admin</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
