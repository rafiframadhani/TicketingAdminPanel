// src/components/management/VenueManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/Table";
import { Button } from "../ui/button";
import apiClient from '../../api/axios';

const VenueManagement = () => {
    const [venues, setVenues] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingVenueId, setEditingVenueId] = useState(null);
    const [editingVenueData, setEditingVenueData] = useState({
        name: '',
        city_id: '',
        latitude: '',
        longitude: ''
    });

    const [newVenueData, setNewVenueData] = useState({
        name: '',
        city_id: '',
        latitude: '',
        longitude: ''
    });

    const fetchVenues = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/venues');
            setVenues(response.data.data);
        } catch (err) {
            console.error("Gagal mengambil daftar venue:", err);
            setError("Gagal mengambil daftar venue. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await apiClient.get('/cities');
            setCities(response.data.data);
        } catch (err) {
            console.error("Gagal mengambil daftar kota:", err);
        }
    };

    useEffect(() => {
        fetchVenues();
        fetchCities();
    }, []);

    const handleAddVenueChange = (e) => {
        const { name, value } = e.target;
        setNewVenueData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditVenueChange = (e) => {
        const { name, value } = e.target;
        setEditingVenueData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddVenue = async () => {
        if (!newVenueData.name.trim() || !newVenueData.city_id || !newVenueData.latitude || !newVenueData.longitude) {
            alert("Semua field untuk venue harus diisi!");
            return;
        }
        try {
            const response = await apiClient.post('/venues', newVenueData);
            alert(response.data.message || "Venue berhasil ditambahkan!");
            setNewVenueData({ name: '', city_id: '', latitude: '', longitude: '' });
            fetchVenues();
        } catch (err) {
            console.error("Gagal menambahkan venue:", err.response ? err.response.data : err.message);
            alert(err.response?.data?.message || "Gagal menambahkan venue.");
        }
    };

    const handleEditClick = (venue) => {
        setEditingVenueId(venue.id);
        setEditingVenueData({
            name: venue.name,
            city_id: venue.city_id,
            latitude: venue.latitude,
            longitude: venue.longitude
        });
    };

    const handleCancelEdit = () => {
        setEditingVenueId(null);
        setEditingVenueData({ name: '', city_id: '', latitude: '', longitude: '' });
    };

    const handleSaveEdit = async (venueId) => {
        if (!editingVenueData.name.trim() || !editingVenueData.city_id || !editingVenueData.latitude || !editingVenueData.longitude) {
            alert("Semua field untuk venue harus diisi!");
            return;
        }
        try {
            // Perbarui semua data yang relevan
            const response = await apiClient.put(`/venues/${venueId}`, editingVenueData);
            alert(response.data.message || "Venue berhasil diperbarui!");
            setEditingVenueId(null);
            setEditingVenueData({ name: '', city_id: '', latitude: '', longitude: '' });
            fetchVenues();
        } catch (err) {
            console.error("Gagal memperbarui venue:", err.response ? err.response.data : err.message);
            alert(err.response?.data?.message || "Gagal memperbarui venue.");
        }
    };

    const handleDeleteVenue = async (venueId) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus venue dengan ID ${venueId}?`)) {
            try {
                const response = await apiClient.delete(`/venues/${venueId}`);
                alert(response.data.message || "Venue berhasil dihapus!");
                fetchVenues();
            } catch (err) {
                console.error("Gagal menghapus venue:", err.response ? err.response.data : err.message);
                alert(err.response?.data?.message || "Gagal menghapus venue.");
            }
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-700">
                Memuat daftar venue...
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Manajemen Venue</h2>

            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Tambah Venue Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="add-name" className="block text-sm font-medium text-gray-700">Nama Venue</label>
                        <input
                            type="text"
                            id="add-name"
                            name="name"
                            placeholder="Nama Venue"
                            value={newVenueData.name}
                            onChange={handleAddVenueChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-city" className="block text-sm font-medium text-gray-700">Kota</label>
                        <select
                            id="add-city"
                            name="city_id"
                            value={newVenueData.city_id}
                            onChange={handleAddVenueChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Pilih Kota</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="add-latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            id="add-latitude"
                            name="latitude"
                            placeholder="Latitude"
                            value={newVenueData.latitude}
                            onChange={handleAddVenueChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            id="add-longitude"
                            name="longitude"
                            placeholder="Longitude"
                            value={newVenueData.longitude}
                            onChange={handleAddVenueChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
                <Button onClick={handleAddVenue} className="mt-4 w-full">Tambah Venue</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead className="w-[200px]">Nama Venue</TableHead> {/* Lebar disesuaikan */}
                        <TableHead className="w-[150px]">Kota</TableHead> {/* Lebar disesuaikan */}
                        <TableHead className="w-[120px]">Latitude</TableHead> {/* Lebar disesuaikan */}
                        <TableHead className="w-[120px]">Longitude</TableHead> {/* Lebar disesuaikan */}
                        {/* Kolom Dibuat Pada dan Diperbarui Pada dihapus */}
                        <TableHead className="text-right w-[180px]">Aksi</TableHead> {/* Lebar disesuaikan */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {venues.length > 0 ? (
                        venues.map((venue) => (
                            <TableRow key={venue.id}>
                                <TableCell className="font-medium">{venue.id}</TableCell>
                                <TableCell>
                                    {editingVenueId === venue.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingVenueData.name}
                                            onChange={handleEditVenueChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    ) : (
                                        venue.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingVenueId === venue.id ? (
                                        <select
                                            name="city_id"
                                            value={editingVenueData.city_id}
                                            onChange={handleEditVenueChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Pilih Kota</option>
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        venue.city ? venue.city.name : 'N/A'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingVenueId === venue.id ? (
                                        <input
                                            type="number"
                                            step="any"
                                            name="latitude"
                                            value={editingVenueData.latitude}
                                            onChange={handleEditVenueChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    ) : (
                                        venue.latitude
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingVenueId === venue.id ? (
                                        <input
                                            type="number"
                                            step="any"
                                            name="longitude"
                                            value={editingVenueData.longitude}
                                            onChange={handleEditVenueChange}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        />
                                    ) : (
                                        venue.longitude
                                    )}
                                </TableCell>
        
                                <TableCell className="text-right">
                                    {editingVenueId === venue.id ? (
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="caution" onClick={handleCancelEdit}>Batal</Button>
                                            <Button variant="success" onClick={() => handleSaveEdit(venue.id)}>Simpan</Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="caution" onClick={() => handleEditClick(venue)}>Edit</Button>
                                            <Button variant="destructive" onClick={() => handleDeleteVenue(venue.id)}>Hapus</Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center">Tidak ada data venue.</TableCell> {/* Mengatur colspan sesuai jumlah kolom baru */}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default VenueManagement;