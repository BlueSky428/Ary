/**
 * API Client
 * Centralized API communication for frontend
 */

import axios from 'axios';
import { ApiResponse } from '@ary/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens (future)
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth_token') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Could redirect to login here
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Demo API
 */
export const demoApi = {
  /**
   * Analyze conversation for demo
   */
  analyze: async (messages: any[]): Promise<ApiResponse<{ signals: any[] }>> => {
    const response = await apiClient.post('/demo/analyze', { messages });
    return response.data;
  },

  /**
   * Join early access list
   */
  joinWaitlist: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/demo/waitlist', { email });
    return response.data;
  },
};

/**
 * Auth API (for future implementation)
 */
export const authApi = {
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};

/**
 * Sessions API (for future implementation)
 */
export const sessionsApi = {
  create: async () => {
    const response = await apiClient.post('/sessions');
    return response.data;
  },

  get: async (sessionId: string) => {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
  },

  sendMessage: async (sessionId: string, content: string) => {
    const response = await apiClient.post(`/sessions/${sessionId}/messages`, {
      content,
    });
    return response.data;
  },

  getMessages: async (sessionId: string) => {
    const response = await apiClient.get(`/sessions/${sessionId}/messages`);
    return response.data;
  },

  end: async (sessionId: string) => {
    const response = await apiClient.post(`/sessions/${sessionId}/end`);
    return response.data;
  },
};

/**
 * Competence API (for future implementation)
 */
export const competenceApi = {
  getTree: async () => {
    const response = await apiClient.get('/competence/tree');
    return response.data;
  },

  updateSignal: async (signalId: string, updates: any) => {
    const response = await apiClient.put(`/competence/tree/signals/${signalId}`, updates);
    return response.data;
  },

  deleteSignal: async (signalId: string) => {
    const response = await apiClient.delete(`/competence/tree/signals/${signalId}`);
    return response.data;
  },
};

export default apiClient;

