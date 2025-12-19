import React, { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './pages/layout';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { LoginPage } from './pages/LoginPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ArtistPage } from './pages/ArtistPage';
import { CollectorPage } from './pages/CollectorPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CreateNFTPage } from './pages/CreateNFTPage';
import { NFTPage } from './pages/NFTPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { AddFundsPage } from './pages/AddFundsPage';

function App(): JSX.Element {
    return (
        <AuthProvider>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="nft/:id" element={<NFTPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/createAccount"
                        element={<CreateAccountPage />}
                    />

                    <Route
                        path="/artist"
                        element={
                            <ProtectedRoute requiredRole="ARTIST">
                                <ArtistPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/collector"
                        element={
                            <ProtectedRoute requiredRole="COLLECTOR">
                                <CollectorPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/editprofile"
                        element={
                            <ProtectedRoute>
                                <EditProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/createNft"
                        element={
                            <ProtectedRoute>
                                <CreateNFTPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                      path='/addFunds'
                      element={
                          <AddFundsPage />
                      }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
