import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialize: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: authToken }
      }).then(response => {
        set({ token: authToken, user: response.data });
      }).catch(() => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      });
    }
  },
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      localStorage.setItem('token', bearerToken);
      set({ token: bearerToken, user });
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },
  register: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, data);
      const { token, user } = response.data;
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      localStorage.setItem('token', bearerToken);
      set({ token: bearerToken, user });
      toast.success('Successfully registered!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Logged out');
  },
}));

if (typeof window !== 'undefined') {
  useAuth.getState().initialize();
} 