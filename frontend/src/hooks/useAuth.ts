import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Changed this to false since we're using token-based auth
});

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (typeof window === 'undefined') return { user: null, token: null };
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  });

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem('token', authState.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }

    if (authState.user) {
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [authState]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user } = response.data;
      
      setAuthState({
        token: access_token,
        user: user,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('A user with this email already exists');
        }
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
  };

  const isAuthenticated = !!authState.token;

  return {
    user: authState.user,
    token: authState.token,
    login,
    register,
    logout,
    isAuthenticated,
  };
} 