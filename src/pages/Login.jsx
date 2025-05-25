// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import apiClient from '../api/axios'; // Import instance Axios

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await apiClient.post('/login', { email, password });
            // Asumsikan respons memiliki properti 'token' dan 'is_admin'
            const { token } = response.data; // Ambil is_admin dari respons

            // Simpan token dan is_admin. Konversi is_admin ke boolean jika perlu.
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', 'true'); // Pastikan tersimpan sebagai boolean true/false

            navigate('/'); // Redirect ke dashboard setelah login berhasil
        } catch (err) {
            console.error("Login failed:", err.response ? err.response.data : err.message);
            // Tangani error berdasarkan respons API
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.status === 401) {
                setError('Email atau password salah.'); // Pesan lebih spesifik untuk 401
            } else {
                setError('Login gagal. Terjadi kesalahan jaringan atau server.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login Admin Panel</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;