import React from 'react';
import { Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
    // Get current date
    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date().toLocaleDateString('en-GB', options);
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const userName = 'John Doe'; // Replace with actual user data
    const userDesignation = 'HR Manager'; // Replace with actual user designation
    const hasNotifications = true; // Set to true when there are notifications

    return (
        <header className="header">
            {/* Left Side - Greeting and Date */}
            <div className="header-left">
                <h2 className="greeting">{getGreeting()} {userName}</h2>
                <p className="date">{getCurrentDate()}</p>
            </div>

            {/* Right Side - Bell Icon, User Info, Profile Picture */}
            <div className="header-right">
                {/* Bell Icon */}
                <button className="bell-button">
                    <Bell size={24} className="bell-icon" />
                    {hasNotifications && <span className="notification-dot"></span>}
                </button>

                {/* Separator */}
                <div className="separator"></div>

                {/* User Info */}
                <div className="user-info">
                    <p className="user-name">{userName}</p>
                    <p className="user-designation">{userDesignation}</p>
                </div>

                {/* Profile Picture */}
                <div className="profile-picture">
                    <img
                        src="https://ui-avatars.com/api/?name=John+Doe&background=FF6B2C&color=fff&size=48"
                        alt="Profile"
                        className="profile-img"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
