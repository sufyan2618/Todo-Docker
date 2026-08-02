import axiosInstance from "../lib/config/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isSigningup: false,
            isLoggingin: false,
            isCheckingAuth: false,
            token: localStorage.getItem('token') || null,
            isAuthenticated: false,
            setUser: (userData) => set({ user: userData }),

    Register: async (userData) => {
            set({ isSigningup: true });
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            const token = response.data.accessToken;
            const user = response.data.data.user;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true });
            return response.data;
        } catch (error) {
            throw error;
        }
        finally {
            set({ isSigningup: false });
        }
    },
    Login: async (credentials) => {
        set({ isLoggingin: true });
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const token = response.data.accessToken;
            const user = response.data.data.user;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true });
            return response.data;
        } catch (error) {
            throw error;
        }
        finally {
            set({ isLoggingin: false });
        }
    },
    Logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        } catch (error) {
            throw error;
        }
        finally {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },
    GetProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/profile');
            const { user } = response.data;
            set({ user });
            return response.data;
        } catch (error) {
            throw error;
        }
        finally {
            set({ isGettingProfile: false });
        }
    },
    
    CheckAuth: async () => {
        set({ isCheckingAuth: true });
        const token = get().token || localStorage.getItem('token');
        
        if (!token) {
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
            return false;
        }

        try {
            const response = await axiosInstance.get('/auth/profile');
            const { user } = response.data;
            set({ user, token, isAuthenticated: true, isCheckingAuth: false });
            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isCheckingAuth: false });
            return false;
        }
    },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
