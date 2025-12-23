import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Box,
    FileText,
    Calendar,
    MessageSquare,
    Database,
    Folder,
    Clipboard,
    Activity,
    LogOut,
    User,
    ChevronDown
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onNavigate }) => {
    const [openDropdowns, setOpenDropdowns] = useState({
        Employee: true,
        'Career Database': false
    });
    const [activeItem, setActiveItem] = useState('Notice Board');

    const handleNavClick = (itemName) => {
        setActiveItem(itemName);
        if (itemName === 'Notice Board' && onNavigate) {
            onNavigate('notice-management');
        }
    };

    const navItems = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutDashboard,
            hasDropdown: false
        },
        {
            id: 2,
            name: 'Employee',
            icon: Users,
            hasDropdown: true,
            subItems: [
                'Employee Database',
                'Add New Employee',
                'Performance Report',
                'Performance History'
            ]
        },
        {
            id: 3,
            name: 'Payroll',
            icon: Box,
            hasDropdown: false
        },
        {
            id: 4,
            name: 'Pay Slip',
            icon: FileText,
            hasDropdown: false
        },
        {
            id: 5,
            name: 'Attendance',
            icon: Calendar,
            hasDropdown: false
        },
        {
            id: 6,
            name: 'Request Center',
            icon: MessageSquare,
            hasDropdown: false
        },
        {
            id: 7,
            name: 'Career Database',
            icon: Database,
            hasDropdown: true,
            subItems: []
        },
        {
            id: 8,
            name: 'Document Manager',
            icon: Folder,
            hasDropdown: false
        },
        {
            id: 9,
            name: 'Notice Board',
            icon: Clipboard,
            hasDropdown: false
        },
        {
            id: 10,
            name: 'Activity Log',
            icon: Activity,
            hasDropdown: false
        },
        {
            id: 11,
            name: 'Exit Interview',
            icon: LogOut,
            hasDropdown: false
        },
        {
            id: 12,
            name: 'Profile',
            icon: User,
            hasDropdown: false
        }
    ];

    const toggleDropdown = (itemName) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    return (
        <aside className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <img
                    src="https://www.nebs-it.com/_next/static/media/logo.cd876701.png"
                    alt="Nebs-IT Logo"
                    className="logo-image"
                />
            </div>

            {/* Navigation List */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.name === 'Employee';
                        const isOpen = openDropdowns[item.name];

                        return (
                            <li key={item.id} className="nav-item">
                                {/* Active/Expanded Employee Item Container */}
                                {isActive && isOpen ? (
                                    <div className="active-dropdown-container">
                                        {/* Main Navigation Item */}
                                        <button
                                            onClick={() => {
                                                if (item.hasDropdown) {
                                                    toggleDropdown(item.name);
                                                } else {
                                                    handleNavClick(item.name);
                                                }
                                            }}
                                            className="nav-button active"
                                        >
                                            <div className="nav-content">
                                                <Icon size={20} className="nav-icon active-icon" />
                                                <span className="nav-text active-text">{item.name}</span>
                                            </div>
                                            {item.hasDropdown && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`chevron ${isOpen ? 'rotate' : ''}`}
                                                />
                                            )}
                                        </button>

                                        {/* Dropdown Sub-menu */}
                                        {item.subItems && item.subItems.length > 0 && (
                                            <ul className="submenu">
                                                {item.subItems.map((subItem, index) => (
                                                    <li key={index}>
                                                        <button className="submenu-button">
                                                            {subItem}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Regular Navigation Item */}
                                        <button
                                            onClick={() => {
                                                if (item.hasDropdown) {
                                                    toggleDropdown(item.name);
                                                } else {
                                                    handleNavClick(item.name);
                                                }
                                            }}
                                            className="nav-button"
                                        >
                                            <div className="nav-content">
                                                <Icon size={20} className="nav-icon" />
                                                <span className="nav-text">{item.name}</span>
                                            </div>
                                            {item.hasDropdown && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`chevron ${isOpen ? 'rotate' : ''}`}
                                                />
                                            )}
                                        </button>

                                        {/* Dropdown Sub-menu for non-active items */}
                                        {item.hasDropdown && isOpen && item.subItems && item.subItems.length > 0 && (
                                            <ul className="submenu-regular">
                                                {item.subItems.map((subItem, index) => (
                                                    <li key={index}>
                                                        <button className="submenu-button">
                                                            {subItem}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
