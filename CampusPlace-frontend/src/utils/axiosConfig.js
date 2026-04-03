import axios from 'axios';
import { backendWarmer } from './backendWarmer';

let isWarmingUp = false;

// Add request interceptor
axios.interceptors.request.use(
  async (config) => {
    // Skip warming for health checks
    if (config.url?.includes('/health')) {
      return config;
    }

    // If backend is not warmed and not already warming, warm it up
    if (!backendWarmer.isWarmed && !isWarmingUp) {
      isWarmingUp = true;
      
      try {
        await backendWarmer.warmUp((status) => {
          console.log('Auto-warming backend:', status);
        });
      } catch (error) {
        console.warn('Failed to warm backend:', error);
      } finally {
        isWarmingUp = false;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a network error or timeout, and haven't retried yet
    if (
      (error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NETWORK' ||
       !error.response) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Try to warm up the backend
      try {
        console.log('Network error detected, attempting to warm backend...');
        await backendWarmer.warmUp();
        
        // Retry the original request
        return axios(originalRequest);
      } catch (warmError) {
        console.error('Failed to recover from network error:', warmError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;

