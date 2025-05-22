// src/components/ConcertForm.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import dummyVenues from '../data/dummyVenues';
import dummyCities from '../data/dummyCities'; // Perlu diimport juga untuk menampilkan nama kota
import dummyGenres from '../data/dummyGenres';

// Helper untuk mendapatkan nama kota dari ID kota di venue
const getCityNameById = (cityId) => {
    const city = dummyCities.find(c => c.id === cityId);
    return city ? city.name : 'Unknown City';
};

const ConcertForm = ({ initialData = {}, onSubmit, onCancel }) => {
    // State untuk data konser
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [concertStart, setConcertStart] = useState(initialData.concertStart || '');
    const [concertEnd, setConcertEnd] = useState(initialData.concertEnd || '');
    const [venueId, setVenueId] = useState(initialData.venueId || '');
    const [linkPoster, setLinkPoster] = useState(initialData.linkPoster || '');
    const [linkVenue, setLinkVenue] = useState(initialData.linkVenue || '');

    // State untuk data tiket (bisa ada banyak tiket untuk satu konser)
    const [tickets, setTickets] = useState(initialData.tickets && initialData.tickets.length > 0 ? initialData.tickets : [{ id: Date.now(), name: '', price: '', quota: '', salesStart: '', salesEnd: '' }]);
    // State untuk genre yang dipilih
    const [selectedGenreIds, setSelectedGenreIds] = useState(initialData.genres ? initialData.genres.map(g => g.id) : []);

    // State untuk daftar opsi (venue, genre)
    const [venueOptions, setVenueOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    useEffect(() => {
        // Populate venue options with city names
        const venuesWithCity = dummyVenues.map(venue => ({
            ...venue,
            cityName: getCityNameById(venue.cityId)
        }));
        setVenueOptions(venuesWithCity);
        setGenreOptions(dummyGenres);
    }, []);

    // Fungsi untuk menambah baris tiket baru
    const addTicketRow = () => {
        setTickets([...tickets, { id: Date.now(), name: '', price: '', quota: '', salesStart: '', salesEnd: '' }]);
    };

    // Fungsi untuk menghapus baris tiket
    const removeTicketRow = (idToRemove) => {
        setTickets(tickets.filter(ticket => ticket.id !== idToRemove));
    };

    // Fungsi untuk mengubah data tiket pada baris tertentu
    const handleTicketChange = (idToUpdate, field, value) => {
        setTickets(tickets.map(ticket =>
            ticket.id === idToUpdate ? { ...ticket, [field]: value } : ticket
        ));
    };

    // Fungsi untuk mengubah pilihan genre
    const handleGenreChange = (genreId) => {
        setSelectedGenreIds(prevSelected => {
            if (prevSelected.includes(genreId)) {
                return prevSelected.filter(id => id !== genreId);
            } else {
                return [...prevSelected, genreId];
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validasi sederhana untuk tiket
        const isValidTickets = tickets.every(ticket =>
            ticket.name && ticket.price && ticket.quota && ticket.salesStart && ticket.salesEnd
        );

        if (!isValidTickets) {
            alert('Mohon lengkapi semua detail tiket.');
            return;
        }

        if (selectedGenreIds.length === 0) {
            alert('Mohon pilih setidaknya satu genre.');
            return;
        }

        const newConcertData = {
            ...initialData, // Pertahankan ID jika ini adalah mode edit
            name,
            description,
            concertStart,
            concertEnd,
            venueId: parseInt(venueId),
            linkPoster,
            linkVenue,
            genres: selectedGenreIds.map(id => dummyGenres.find(g => g.id === id)), // Konversi ID kembali ke objek genre
            tickets: tickets.map(t => ({
                ...t,
                price: parseInt(t.price),
                quota: parseInt(t.quota),
            })),
        };
        onSubmit(newConcertData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Konser */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Konser</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {/* Venue */}
                <div>
                    <label htmlFor="venueId" className="block text-sm font-medium text-gray-700">Venue</label>
                    <select
                        id="venueId"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={venueId}
                        onChange={(e) => setVenueId(e.target.value)}
                        required
                    >
                        <option value="">Pilih Venue</option>
                        {venueOptions.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                                {venue.name} ({venue.cityName})
                            </option>
                        ))}
                    </select>
                </div>
                {/* Waktu Mulai */}
                <div>
                    <label htmlFor="concertStart" className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
                    <input
                        type="datetime-local"
                        id="concertStart"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={concertStart}
                        onChange={(e) => setConcertStart(e.target.value)}
                        required
                    />
                </div>
                {/* Waktu Selesai */}
                <div>
                    <label htmlFor="concertEnd" className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
                    <input
                        type="datetime-local"
                        id="concertEnd"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={concertEnd}
                        onChange={(e) => setConcertEnd(e.target.value)}
                        required
                    />
                </div>
                {/* Link Poster */}
                <div>
                    <label htmlFor="linkPoster" className="block text-sm font-medium text-gray-700">Link Poster</label>
                    <input
                        type="url"
                        id="linkPoster"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={linkPoster}
                        onChange={(e) => setLinkPoster(e.target.value)}
                    />
                </div>
                {/* Link Venue (Google Maps) */}
                <div>
                    <label htmlFor="linkVenue" className="block text-sm font-medium text-gray-700">Link Google Maps Venue</label>
                    <input
                        type="url"
                        id="linkVenue"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={linkVenue}
                        onChange={(e) => setLinkVenue(e.target.value)}
                    />
                </div>
            </div>

            {/* Deskripsi */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                    id="description"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Genre Pilihan */}
            <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Genre Konser</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {genreOptions.map((genre) => (
                        <div key={genre.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`genre-${genre.id}`}
                                checked={selectedGenreIds.includes(genre.id)}
                                onChange={() => handleGenreChange(genre.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={`genre-${genre.id}`} className="ml-2 text-sm text-gray-700">
                                {genre.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Tiket */}
            <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Detail Tiket</h3>
                {tickets.map((ticket, index) => (
                    <div key={ticket.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-3 border rounded-md bg-white shadow-sm">
                        {/* Nama Tiket */}
                        <div>
                            <label htmlFor={`ticket-name-${ticket.id}`} className="block text-sm font-medium text-gray-700">Nama Tiket</label>
                            <input
                                type="text"
                                id={`ticket-name-${ticket.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                                required
                            />
                        </div>
                        {/* Harga */}
                        <div>
                            <label htmlFor={`ticket-price-${ticket.id}`} className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                            <input
                                type="number"
                                id={`ticket-price-${ticket.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                value={ticket.price}
                                onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                                required
                            />
                        </div>
                        {/* Quota */}
                        <div>
                            <label htmlFor={`ticket-quota-${ticket.id}`} className="block text-sm font-medium text-gray-700">Kuota</label>
                            <input
                                type="number"
                                id={`ticket-quota-${ticket.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                value={ticket.quota}
                                onChange={(e) => handleTicketChange(ticket.id, 'quota', e.target.value)}
                                required
                            />
                        </div>
                        {/* Waktu Mulai Penjualan */}
                        <div>
                            <label htmlFor={`ticket-sales-start-${ticket.id}`} className="block text-sm font-medium text-gray-700">Penjualan Mulai</label>
                            <input
                                type="datetime-local"
                                id={`ticket-sales-start-${ticket.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                value={ticket.salesStart}
                                onChange={(e) => handleTicketChange(ticket.id, 'salesStart', e.target.value)}
                                required
                            />
                        </div>
                        {/* Waktu Selesai Penjualan */}
                        <div>
                            <label htmlFor={`ticket-sales-end-${ticket.id}`} className="block text-sm font-medium text-gray-700">Penjualan Selesai</label>
                            <input
                                type="datetime-local"
                                id={`ticket-sales-end-${ticket.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
                                value={ticket.salesEnd}
                                onChange={(e) => handleTicketChange(ticket.id, 'salesEnd', e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-end justify-end col-span-1 sm:col-span-2 lg:col-span-1">
                            {tickets.length > 1 && (
                                <Button type="button" variant="destructive" onClick={() => removeTicketRow(ticket.id)}>
                                    Hapus Tiket
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                <Button type="button" variant="secondary" onClick={addTicketRow} className="mt-4">Tambah Tiket Lain</Button>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Batal</Button>
                <Button type="submit">Simpan Konser</Button>
            </div>
        </form>
    );
};

export default ConcertForm;