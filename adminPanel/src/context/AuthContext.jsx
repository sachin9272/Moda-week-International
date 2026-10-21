    import React, { createContext, useState, useEffect, useContext } from 'react';
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
        const [role, setRole] = useState(null);
        const [permissions, setPermissions] = useState({});
        const [loading, setLoading] = useState(true);
        const [loadingPermissions, setLoadingPermissions] = useState(true);

        const fetchMyPermissions = async (authToken) => {
            try {
                const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
                const res = await axios.get(`${baseURL}/api/admin/my-permissions`, config);
                if (res.data.success && res.data.data) {
                    setPermissions(res.data.data.permissions || {});
                    setRole(res.data.data.role || 'Admin Access');
                }
            } catch (err) {
                console.error('Failed to load user permissions:', err);
            } finally {
                setLoadingPermissions(false);
            }
        };

        const hasPermission = (section, action = 'view') => {
            if (!user) return false;
            // Super Admin always has full access
            if (role === 'Super Admin') return true;
            if (!permissions) return false;
            const sec = permissions[section];
            return Boolean(sec && sec[action] === true);
        };
    
        useEffect(() => {
            const clearStoredAuth = () => {
                localStorage.removeItem('adminUser');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
                setRole(null);
                setPermissions({});
                setLoadingPermissions(false);
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
    
            // ── 1. Check for SSO callback query parameters from Master Admin ──
            const urlParams = new URLSearchParams(window.location.search);
            const ssoToken = urlParams.get('sso_token');
            const ssoEmail = urlParams.get('email');
            const ssoId = urlParams.get('id');
    
            if (ssoToken && !isTokenExpired(ssoToken)) {
                const adminData = {
                    success: true,
                    _id: ssoId || 'sso_admin',
                    email: ssoEmail || 'info@modaweekinternational.com',
                    token: ssoToken,
                };
                localStorage.setItem('adminUser', JSON.stringify(adminData));
                setUser(adminData);
                axios.defaults.headers.common['Authorization'] = `Bearer ${ssoToken}`;
    
                // Clean query parameters from address bar
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
    
                fetchMyPermissions(ssoToken);
                setLoading(false);
                return;
            }
    
            // ── 2. Cookie fallback ──
            if (!getStoredAdmin()) {
                const match = document.cookie.match(new RegExp('(^| )admin_sso_token=([^;]+)'));
                if (match && match[2] && !isTokenExpired(match[2])) {
                    const cookieToken = match[2];
                    const adminData = {
                        success: true,
                        _id: 'sso_admin',
                        email: 'info@modaweekinternational.com',
                        token: cookieToken,
                    };
                    localStorage.setItem('adminUser', JSON.stringify(adminData));
                    setUser(adminData);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${cookieToken}`;
                    fetchMyPermissions(cookieToken);
                    setLoading(false);
                    return;
                }
            }
    
            // ── 3. Normal local storage check (standard manual login flow) ──
            const storedAdmin = getStoredAdmin();
            const token = getAdminToken(storedAdmin);
    
            if (storedAdmin && token && !isTokenExpired(token)) {
                setUser(storedAdmin);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                fetchMyPermissions(token);
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
                        await fetchMyPermissions(token);
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
            setRole(null);
            setPermissions({});
            localStorage.removeItem('adminUser');
            delete axios.defaults.headers.common['Authorization'];
        };

        return (
            <AuthContext.Provider value={{ 
                user, 
                role, 
                permissions, 
                loading, 
                loadingPermissions, 
                login, 
                logout, 
                hasPermission, 
                refreshPermissions: fetchMyPermissions 
            }}>
                {!loading && children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };
