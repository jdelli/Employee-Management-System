import axios from 'axios';

// Assuming the token is stored in localStorage after user logs in
const API_BASE_URL = 'http://127.0.0.1:8002/api';

const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to inject the token if it's available in localStorage
apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Or use sessionStorage or context, depending on your app's setup
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiService;
