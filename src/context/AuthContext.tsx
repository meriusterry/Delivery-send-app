import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    error: string | null;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            console.log('Attempting login...');
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            console.log('Login successful, user set:', user);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            setError(null);
            console.log('Attempting registration...');
            const response = await api.post('/auth/register', userData);
            console.log('Register response:', response.data);
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            console.log('Registration successful, user set:', user);
        } catch (err: any) {
            console.error('Register error:', err);
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};