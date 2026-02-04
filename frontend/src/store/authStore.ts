import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    name?: string;
    isPro: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any) => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: true,

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    register: async (email: string, password: string, name: string) => {
        try {
            const response = await api.post('/auth/register', { email, password, name });
            const { token, user } = response.data;

            localStorage.setItem('auth_token', token);
            set({ user, token, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    googleLogin: async (token: string) => {
        try {
            const response = await api.post('/auth/google-login', { token });
            const { token: jwtToken, user } = response.data;

            localStorage.setItem('auth_token', jwtToken);
            set({ user, token: jwtToken, isAuthenticated: true });
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            set({ isLoading: false });
            return;
        }

        try {
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('auth_token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
