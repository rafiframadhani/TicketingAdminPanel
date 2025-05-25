// src/api/axios.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token ke setiap request (kecuali login)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        if (token && config.url !== '/login') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk menangani error respons
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response && error.response.status === 401) {
            console.error("Unauthorized request. Redirecting to login.");
            // Opsional: Redirect ke halaman login jika token tidak valid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;