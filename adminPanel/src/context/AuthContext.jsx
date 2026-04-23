import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config/api';

export const AuthContext = createContext();

const getStoredAdmin = () => {
    const userInfo = localStorage.getItem('adminUser');
    if (!userInfo) return null;

    try {
        return JSON.parse(userInfo);
    } catch (error) {
        console.error('Failed to parse stored admin user:', error);
        localStorage.removeItem('adminUser');
        return null;
    }
};

const getAdminToken = (adminData) => {
    if (!adminData) return null;
    return adminData.token || adminData.data?.token || null;
};

const decodeJwtPayload = (token) => {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;

        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');

        return JSON.parse(window.atob(padded));
    } catch (error) {
        console.error('Failed to decode admin token:', error);
        return null;
    }
};

const isTokenExpired = (token) => {
    if (!token) return true;

    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;

    return payload.exp * 1000 <= Date.now();
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const clearStoredAuth = () => {
            localStorage.removeItem('adminUser');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        };

        const interceptor = axios.interceptors.request.use((config) => {
            const storedAdmin = getStoredAdmin();
            const token = getAdminToken(storedAdmin);

            if (token && !isTokenExpired(token)) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            } else if (storedAdmin) {
                clearStoredAuth();
            }

            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const message = error.response?.data?.message;
                if (error.response?.status === 401 && message?.toLowerCase().includes('token')) {
                    clearStoredAuth();
                }

                return Promise.reject(error);
            }
        );

        const storedAdmin = getStoredAdmin();
        const token = getAdminToken(storedAdmin);

        if (storedAdmin && token && !isTokenExpired(token)) {
            setUser(storedAdmin);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            clearStoredAuth();
        }

        setLoading(false);

        return () => {
            axios.interceptors.request.eject(interceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${baseURL}/api/admin/login`, { email, password });
            if (data.success) {
                setUser(data);
                localStorage.setItem('adminUser', JSON.stringify(data));
                const token = getAdminToken(data);
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return { success: true };
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
