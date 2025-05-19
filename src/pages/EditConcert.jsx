import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import dummyConcerts from '../data/dummyConcerts';

const EditConcert = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [concertStart, setConcertStart] = useState('');
  const [concertEnd, setConcertEnd] = useState('');

  useEffect(() => {
    // Simulasi pengambilan data konser berdasarkan ID
    const fetchedConcert = dummyConcerts.find((c) => c.id === parseInt(id));
    if (fetchedConcert) {
      setConcert(fetchedConcert);
      setName(fetchedConcert.name);
      setDescription(fetchedConcert.description);
      setConcertStart(fetchedConcert.concertStart);
      setConcertEnd(fetchedConcert.concertEnd);
    } else {
      // Redirect ke halaman konser jika ID tidak valid
      navigate('/concerts');
    }
  }, [id, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulasi update data konser
    const updatedConcert = {
      ...concert,
      name,
      description,
      concertStart,
      concertEnd,
      // Tambahkan field lain yang bisa diedit
    };
    console.log('Data konser yang diupdate:', updatedConcert);
    // Di sini nanti kita akan melakukan PUT/PATCH ke API

    // Setelah berhasil diupdate, redirect ke halaman daftar konser
    navigate('/concerts');
  };

  const handleCancel = () => {
    navigate('/concerts');
  };

  if (!concert) {
    return <div>Loading...</div>; // Tampilkan pesan loading saat data belum tersedia
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Konser</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Konser</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="description"
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="concertStart" className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
          <input
            type="datetime-local"
            id="concertStart"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={concertStart}
            onChange={(e) => setConcertStart(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="concertEnd" className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
          <input
            type="datetime-local"
            id="concertEnd"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={concertEnd}
            onChange={(e) => setConcertEnd(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" className="mr-2" onClick={handleCancel}>Batal</Button>
          <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>
    </div>
  );
};

export default EditConcert;