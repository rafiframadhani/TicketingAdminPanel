// src/components/management/GenreManagement.jsx
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

const GenreManagement = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [editingGenreName, setEditingGenreName] = useState('');
  const [newGenreName, setNewGenreName] = useState('');

  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/genres');
      setGenres(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil daftar genre:", err);
      setError("Gagal mengambil daftar genre. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    if (!newGenreName.trim()) {
      alert("Nama genre tidak boleh kosong!");
      return;
    }
    try {
      const response = await apiClient.post('/genres', { name: newGenreName });
      alert(response.data.message || "Genre berhasil ditambahkan!");
      setNewGenreName('');
      fetchGenres();
    } catch (err) {
      console.error("Gagal menambahkan genre:", err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Gagal menambahkan genre.");
    }
  };

  const handleEditClick = (genre) => {
    setEditingGenreId(genre.id);
    setEditingGenreName(genre.name);
  };

  const handleCancelEdit = () => {
    setEditingGenreId(null);
    setEditingGenreName('');
  };

  const handleSaveEdit = async (genreId) => {
    if (!editingGenreName.trim()) {
      alert("Nama genre tidak boleh kosong!");
      return;
    }
    try {
      const response = await apiClient.put(`/genres/${genreId}`, { name: editingGenreName });
      alert(response.data.message || "Genre berhasil diperbarui!");
      setEditingGenreId(null);
      setEditingGenreName('');
      fetchGenres();
    } catch (err) {
      console.error("Gagal memperbarui genre:", err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Gagal memperbarui genre.");
    }
  };

  const handleDeleteGenre = async (genreId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus genre dengan ID ${genreId}?`)) {
      try {
        const response = await apiClient.delete(`/genres/${genreId}`);
        alert(response.data.message || "Genre berhasil dihapus!");
        fetchGenres();
      } catch (err) {
        console.error("Gagal menghapus genre:", err.response ? err.response.data : err.message);
        alert(err.response?.data?.message || "Gagal menghapus genre.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700">
        Memuat daftar genre...
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
      <h2 className="text-xl font-bold mb-4 text-gray-800">Manajemen Genre</h2>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Tambah Genre Baru</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nama Genre Baru"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <Button onClick={handleAddGenre}>Tambah</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {/* Mengatur lebar kolom ID */}
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead className="w-auto">Nama Genre</TableHead>
            <TableHead className="text-right w-[180px]">Aksi</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
          {genres.length > 0 ? (
            genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium w-[80px]">{genre.id}</TableCell>
                <TableCell className="w-auto"> {/* Terapkan lebar ke TableCell ini */}
                  {editingGenreId === genre.id ? (
                    <input
                      type="text"
                      value={editingGenreName}
                      onChange={(e) => setEditingGenreName(e.target.value)}
                      // input ini akan mengisi 100% dari TableCell-nya
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    genre.name
                  )}
                </TableCell>
                <TableCell className="text-right w-[180px]"> {/* Terapkan lebar ke TableCell ini */}
                  {editingGenreId === genre.id ? (
                    <div className="flex justify-end space-x-2">
                      <Button variant="caution" onClick={handleCancelEdit}>Batal</Button>
                      <Button variant="success" onClick={() => handleSaveEdit(genre.id)}>Simpan</Button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button variant="caution" onClick={() => handleEditClick(genre)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteGenre(genre.id)}>Hapus</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="3" className="text-center">Tidak ada data genre.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GenreManagement;