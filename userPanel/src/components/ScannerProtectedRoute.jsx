import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config/api';
import { Loader } from 'lucide-react';

const ScannerProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('scannerToken');
            
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const res = await axios.get(`${baseURL}/api/scanner/verify`, config);
                if (res.data.success) {
                    // Keep operator user details in localStorage for convenience
                    localStorage.setItem('scannerUser', JSON.stringify(res.data.user));
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Scanner token verification failed:', error);
                // If deactivated or expired, clear token
                localStorage.removeItem('scannerToken');
                localStorage.removeItem('scannerUser');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white p-6">
                <Loader className="animate-spin text-[#C7913E] mb-4" size={40} />
                <p className="text-neutral-400 animate-pulse tracking-widest text-sm font-semibold uppercase">Authenticating Scanner...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/scanner/login" replace />;
    }

    return children;
};

export default ScannerProtectedRoute;
