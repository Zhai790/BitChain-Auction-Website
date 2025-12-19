import React, { JSX, useState } from 'react';
import { PrimaryButton } from './button';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavBar(): JSX.Element {
    const { user, isLoggedIn, logout } = useAuth();
    const [hamburgerMenu, setHamburgerMenu] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setHamburgerMenu(false);
        if (!user) return;
        if (user.role === 'ARTIST') navigate('/artist');
        if (user.role === 'COLLECTOR') navigate('/collector');

    };

    const handleLogout = () => {
        setHamburgerMenu(false);
        logout();
    }

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/">
                        <img
                            src="/bidchain-logo.svg"
                            alt="BidChain logo"
                            className="navbar-logo"
                        />
                    </Link>
                    <span className="navbar-brand">BidChain</span>
                </div>

                <div className="navbar-right">
                    <nav className="navbar-links">
                        <Link to="/marketplace">Marketplace</Link>
                        <Link to="/addFunds">Add Funds</Link>
                    </nav>

                    {isLoggedIn ? (
                        <>
                            <IconButton
                                className="user-icon-button"
                                onClick={handleProfileClick}
                                sx={{
                                    color: "#a259ff",
                                    width:"44px",
                                    height:"44px",
                                    borderRadius:"10px",
                                    border:"2px solid #a259ff",
                                    display:"flex",
                                    alignItems:"center"
                                }}
                            >
                                <PersonIcon />
                            </IconButton>

                            <PrimaryButton
                                text="Sign out"
                                ariaLabel="Sign out"
                                onClick={logout}
                            />
                        </>
                    ) : (
                        <Link to="/login">
                            <PrimaryButton text="Login" icon={PersonIcon} />
                        </Link>
                    )}
                </div>
                <IconButton
                    className="navbar-hamburger"
                    onClick={() => setHamburgerMenu(prev => !prev)}
                    sx={{ 
                        color: "#fff",
                        display: "none",  
                        "@media (max-width: 768px)": {
                            display: "flex"
                        }  
                    }}
                >
                    <MenuIcon fontSize="large" />
                </IconButton>
            </div>
            {hamburgerMenu && (
                <div className="mobile-menu">
                    <Link to="/marketplace" onClick={() => setHamburgerMenu(false)}>Marketplace</Link>
                    <Link to="/addFunds" onClick={() => setHamburgerMenu(false)}>Add Funds</Link>

                    {isLoggedIn ? (
                        <>
                            <button onClick={handleProfileClick}>Profile</button>
                            <button onClick={handleLogout}>Sign out</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setHamburgerMenu(false)}>Login</Link>
                    )}
                </div>
            )}
        </header>
    );
}
