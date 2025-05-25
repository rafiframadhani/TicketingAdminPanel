// src/components/management/CityManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import apiClient from '../../api/axios';

const CityManagement = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCityId, setEditingCityId] = useState(null);
    const [editingCityName, setEditingCityName] = useState('');
    const [newCityName, setNewCityName] = useState('');

    const fetchCities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/cities');
            setCities(response.data.data);
        } catch (err) {
            console.error("Gagal mengambil daftar kota:", err);
            setError("Gagal mengambil daftar kota. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleEditClick = (city) => {
        setEditingCityId(city.id);
        setEditingCityName(city.name);
    };

    const handleCancelEdit = () => {
        setEditingCityId(null);
        setEditingCityName('');
    };

    const handleSaveEdit = async (cityId) => {
        if (!editingCityName.trim()) {
            alert("Nama kota tidak boleh kosong!");
            return;
        }
        try {
            const response = await apiClient.put(`/cities/${cityId}`, { name: editingCityName });
            alert(response.data.message || "Kota berhasil diperbarui!");
            setEditingCityId(null);
            setEditingCityName('');
            fetchCities();
        } catch (err) {
            console.error("Gagal memperbarui kota:", err.response ? err.response.data : err.message);
            alert(err.response?.data?.message || "Gagal memperbarui kota.");
        }
    };

    const handleDeleteCity = async (cityId) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kota dengan ID ${cityId}?`)) {
            try {
                const response = await apiClient.delete(`/cities/${cityId}`);
                alert(response.data.message || "Kota berhasil dihapus!");
                fetchCities();
            } catch (err) {
                console.error("Gagal menghapus kota:", err.response ? err.response.data : err.message);
                alert(err.response?.data?.message || "Gagal menghapus kota.");
            }
        }
    };

    const handleAddCity = async () => {
        if (!newCityName.trim()) {
            alert("Nama kota baru tidak boleh kosong!");
            return;
        }
        try {
            const response = await apiClient.post('/cities', { name: newCityName });
            alert(response.data.message || "Kota berhasil ditambahkan!");
            setNewCityName('');
            fetchCities();
        } catch (err) {
            console.error("Gagal menambahkan kota:", err.response ? err.response.data : err.message);
            alert(err.response?.data?.message || "Gagal menambahkan kota.");
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-700">
                Memuat daftar kota...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Manajemen Kota</h2>

            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Tambah Kota Baru</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Nama Kota Baru"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <Button onClick={handleAddCity}>Tambah</Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {/* Mengatur lebar kolom ID */}
                        <TableHead className="w-[80px]">ID</TableHead>
                        {/* Kolom Nama Kota akan mengambil sebagian besar sisa ruang */}
                        <TableHead className="w-auto">Nama Kota</TableHead>
                        {/* Mengatur lebar kolom Aksi */}
                        <TableHead className="text-right w-[180px]">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cities.length > 0 ? (
                        cities.map((city) => (
                            <TableRow key={city.id}>
                                <TableCell className="font-medium w-[80px]">{city.id}</TableCell>
                                <TableCell className="w-auto"> {/* Terapkan lebar ke TableCell ini */}
                                    {editingCityId === city.id ? (
                                        <input
                                            type="text"
                                            value={editingCityName}
                                            onChange={(e) => setEditingCityName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    ) : (
                                        city.name
                                    )}
                                </TableCell>
                                <TableCell className="text-right w-[120px]">
                                    {editingCityId === city.id ? (
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="caution" onClick={handleCancelEdit}>Batal</Button>
                                            <Button onClick={() => handleSaveEdit(city.id)}>Simpan</Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="caution" onClick={() => handleEditClick(city)}>Edit</Button>
                                            <Button variant="destructive" onClick={() => handleDeleteCity(city.id)}>Hapus</Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="3" className="text-center">Tidak ada data kota.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CityManagement;