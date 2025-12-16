import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('adminUser');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            // Set default headers for axios
            if (parsedUser.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${baseURL}/api/admin/login`, { email, password });
            if (data.success) {
                setUser(data);
                localStorage.setItem('adminUser', JSON.stringify(data));
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
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
