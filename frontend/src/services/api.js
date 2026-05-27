import axios from 'axios';

const configuredUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedApiBase = configuredUrl.replace(/\/$/, '');
const baseUrl = normalizedApiBase.endsWith('/api') ? normalizedApiBase : `${normalizedApiBase}/api`;

const api = axios.create({
    baseURL: baseUrl,
});

// Interceptor for attaching token
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;
