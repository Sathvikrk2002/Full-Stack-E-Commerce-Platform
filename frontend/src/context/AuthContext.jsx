import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (from localStorage for session persistence)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const register = async (email, password) => {
        try {
            const response = await api.post('/auth/register', { email, password });
            const data = response.data;
            
            if (data.success) {
                const userData = { 
                    email: data.email, 
                    role: data.role,
                    loginTime: new Date().toISOString() 
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, role: data.role };
            }
            
            return { success: false, message: data.message };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            
            if (data.success) {
                const userData = { 
                    email: data.email, 
                    role: data.role,
                    loginTime: new Date().toISOString() 
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true, role: data.role };
            }
            
            return { success: false, message: data.message };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
