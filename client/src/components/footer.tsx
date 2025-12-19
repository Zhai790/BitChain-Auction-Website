import React, { JSX } from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

export function Footer(): JSX.Element {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img
                    src="/bidchain-logo.svg"
                    alt="BidChain logo"
                    className="footer-logo"
                />
            </div>

            <div className="footer-links">
                <Link to="/marketplace">Marketplace</Link>
                <Link to="/addFunds">Add Funds</Link>
            </div>
        </footer>
    );
}
