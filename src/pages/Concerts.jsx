// src/pages/Concerts.jsx
import { useEffect, useState } from "react";
import dummyConcerts, { getVenueById } from "../data/dummyConcerts"; // Import getVenueById
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/Table";
import { Button } from "../components/ui/button";
import ConcertForm from "../components/ConcertForm"; // Import ConcertForm yang baru
import { Link } from "react-router-dom";
import dummyCities from "../data/dummyCities"; // Import dummyCities untuk menampilkan nama kota venue
import dummyVenues from "../data/dummyVenues"; // Import dummyVenues

// Helper untuk mendapatkan nama kota dari ID kota di venue
const getCityNameById = (cityId) => {
  const city = dummyCities.find(c => c.id === cityId);
  return city ? city.name : 'Unknown City';
};

export default function Concerts() {
  const [concerts, setConcerts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // Mengganti isAdding menjadi isFormOpen
  const [editingConcert, setEditingConcert] = useState(null); // State untuk data konser yang sedang diedit

  useEffect(() => {
    setConcerts(dummyConcerts);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus konser ini?")) {
      setConcerts(concerts.filter((concert) => concert.id !== id));
      console.log("Konser dihapus:", id);
      // Di sini nanti kita akan melakukan DELETE ke API
    }
  };

  const handleSaveConcert = (newOrUpdatedConcert) => {
    if (newOrUpdatedConcert.id && concerts.some(c => c.id === newOrUpdatedConcert.id)) {
      // Mode Edit
      setConcerts(concerts.map(concert =>
        concert.id === newOrUpdatedConcert.id ? newOrUpdatedConcert : concert
      ));
      console.log("Konser diupdate:", newOrUpdatedConcert);
      // Di sini nanti kita akan melakukan PUT/PATCH ke API
    } else {
      // Mode Tambah
      // Untuk simulasi, beri ID baru jika tidak ada ID atau ID belum ada di daftar konser
      const newId = Math.max(...concerts.map(c => c.id), 0) + 1;
      setConcerts([...concerts, { ...newOrUpdatedConcert, id: newId }]);
      console.log("Konser baru ditambahkan:", { ...newOrUpdatedConcert, id: newId });
      // Di sini nanti kita akan melakukan POST ke API
    }
    setIsFormOpen(false); // Tutup form setelah simpan
    setEditingConcert(null); // Reset data yang diedit
  };

  const handleEditClick = (concert) => {
    setEditingConcert(concert);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingConcert(null); // Reset data yang diedit saat batal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Daftar Konser & Tiket</h1>
      <div className="mb-4 flex justify-end">
        {/* MODIFIKASI BARIS INI */}
        <Button onClick={() => { setIsFormOpen(true); setEditingConcert({}); }} className="bg-blue-600 hover:bg-blue-700 text-white">Tambah Konser Baru</Button> {/* Pastikan initialData adalah objek kosong {} */}
      </div>

      {isFormOpen && (
        <div className="mb-6 p-6 border rounded-lg bg-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingConcert && Object.keys(editingConcert).length > 0 ? 'Edit Konser' : 'Tambah Konser Baru'} {/* Perbaiki kondisi cek editingConcert */}
          </h2>
          <ConcertForm
            initialData={editingConcert}
            onSubmit={handleSaveConcert}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Konser</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Tiket</TableHead> {/* Kolom baru untuk tiket */}
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerts.map((concert) => {
            const venue = getVenueById(concert.venueId);
            const venueName = venue ? `${venue.name} (${getCityNameById(venue.cityId)})` : 'Unknown Venue';

            return (
              <TableRow key={concert.id}>
                <TableCell>{concert.id}</TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{concert.name}</p>
                  {concert.linkPoster && (
                    <a href={concert.linkPoster} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                      Poster
                    </a>
                  )}
                </TableCell>
                <TableCell>{concert.description}</TableCell>
                <TableCell>
                  {new Date(concert.concertStart).toLocaleString()} –{" "}
                  {new Date(concert.concertEnd).toLocaleString()}
                </TableCell>
                <TableCell>
                  <p>{venueName}</p>
                  {venue && concert.linkVenue && (
                    <a href={concert.linkVenue} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                      Lihat di Maps
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {concert.genres && concert.genres.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {concert.genres.map((genre) => (
                        <li key={genre.id} className="text-xs">{genre.name}</li>
                      ))}
                    </ul>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {concert.tickets && concert.tickets.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {concert.tickets.map((ticket) => (
                        <li key={ticket.id} className="text-xs">
                          {ticket.name} (Rp{ticket.price.toLocaleString()}) - Quota: {ticket.quota}
                          <br />
                          <span className="text-gray-500">
                            {new Date(ticket.salesStart).toLocaleDateString()} - {new Date(ticket.salesEnd).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : '-'}
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <Button variant="outline" className="mr-2" onClick={() => handleEditClick(concert)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(concert.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}