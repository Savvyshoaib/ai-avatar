import axios from 'axios';
import { getStore } from '../store/storeRef';
import { removeToken } from '../store/slices/userSlice';

// Create axios instance with default config
const Api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',  // ✅ force correct type
    },
    timeout: 60000,
    withCredentials: false, // ✅ disable credentials for now
  });

// Request interceptor - add auth token to headers
Api.interceptors.request.use(
  async (config) => {
    // Get token from store
    const store = getStore();
    const token = store?.getState()?.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If FormData is being sent, let axios set Content-Type automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, message: networkError } = error;
    const errorMessage = response?.data?.message || networkError || 'An error occurred';

    // Handle 401 Unauthorized - remove token and redirect to login
    if (response?.status === 401 && errorMessage === 'Unauthenticated.') {
      const store = getStore();
      if (store) {
        store.dispatch(removeToken());
      }
    }

    return Promise.reject(error);
  }
);

export default Api;

