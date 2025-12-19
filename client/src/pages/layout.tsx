import React, { JSX } from 'react';
import { NavBar } from '../components/navbar';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/footer';

type LayoutProps = {
    isLoggedIn: boolean;
    onSignOut: () => void;
};

export function Layout(): JSX.Element {
    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
}
