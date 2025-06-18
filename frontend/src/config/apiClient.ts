/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const REFRESH_TOKEN_ENDPOINT = "/auth/refresh"; 
const LOGOUT_ENDPOINT = "/auth/logout";      
const LOGIN_ENDPOINT = "/auth/login";         

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7134/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, tokenRefreshed: boolean = false) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (tokenRefreshed) { 
      prom.resolve(); 
    } else {
        prom.reject(new Error('Token refresh process completed without explicit success.'));
    }
  });
  failedQueue = [];
};

let logoutInitiated = false;

const initiateGlobalLogout = () => {
  if (!logoutInitiated) {
    logoutInitiated = true;
    // console.log("Interceptor: Initiating global logout.");
    
    const logoutEvent = new CustomEvent('app:forceLogout');
    window.dispatchEvent(logoutEvent);

    setTimeout(() => {
      logoutInitiated = false;
    }, 3000); 
  }
};


apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => { 
    const originalRequest = error.config as InternalAxiosRequestConfig<any> & { _retry?: boolean };

    if (!error.response) {
        console.error("Network error or no response received:", error);
        return Promise.reject(error);
    }

    const { status,  } = error.response;
    const requestUrl = originalRequest.url;

    const isAuthProcessEndpoint = 
        requestUrl?.endsWith(REFRESH_TOKEN_ENDPOINT) || 
        requestUrl?.endsWith(LOGOUT_ENDPOINT) ||
        requestUrl?.endsWith(LOGIN_ENDPOINT);

    if (status === 401 && !isAuthProcessEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
     
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest)) 
          .catch((err) => Promise.reject(err));
      }

      // console.log("Interceptor: Detected 401. Attempting token refresh.");
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        apiClient.post(REFRESH_TOKEN_ENDPOINT, {})
          .then(() => {
            // console.log("Interceptor: Token refreshed successfully.");
            processQueue(null, true); 
            resolve(apiClient(originalRequest)); 
          })
          .catch((refreshError: AxiosError) => {
            console.error("Interceptor: Failed to refresh token.", refreshError);
            processQueue(refreshError, false); 
             initiateGlobalLogout();
            reject(refreshError); 
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    if (status === 401 && requestUrl?.endsWith(REFRESH_TOKEN_ENDPOINT)) {
      // console.error("Interceptor: Received 401 on refresh token endpoint. Logging out.");
      initiateGlobalLogout();
    }
    
    
    return Promise.reject(error);
  }
);

export default apiClient;