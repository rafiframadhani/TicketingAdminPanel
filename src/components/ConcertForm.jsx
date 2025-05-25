import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import apiClient from '../api/axios'; // Import apiClient
import { format } from 'date-fns'; // Import format dari date-fns

const ConcertForm = ({ initialData = {}, onSubmit, onCancel }) => {
    // State untuk data konser
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');
    // Format tanggal dari API (ISO string) ke format datetime-local
    const [concertStart, setConcertStart] = useState(
        initialData.concert_start ? format(new Date(initialData.concert_start), "yyyy-MM-dd'T'HH:mm") : ''
    );
    const [concertEnd, setConcertEnd] = useState(
        initialData.concert_end ? format(new Date(initialData.concert_end), "yyyy-MM-dd'T'HH:mm") : ''
    );
    const [venueId, setVenueId] = useState(initialData.venue_id || '');
    // Untuk file input, kita tidak akan mengisi string URL, tapi biarkan null atau File object
    const [linkPosterFile, setLinkPosterFile] = useState(null);
    const [linkVenueFile, setLinkVenueFile] = useState(null);
    // Simpan URL yang ada untuk tampilan jika mode edit
    const [currentLinkPosterUrl, setCurrentLinkPosterUrl] = useState(initialData.link_poster || '');
    const [currentLinkVenueUrl, setCurrentLinkVenueUrl] = useState(initialData.link_venue || '');


    // State untuk data tiket
    const [tickets, setTickets] = useState(
        initialData.tickets && initialData.tickets.length > 0
            ? initialData.tickets.map(t => ({
                ...t,
                // Pastikan format tanggal tiket juga sesuai untuk datetime-local
                sales_start: t.sales_start ? format(new Date(t.sales_start), "yyyy-MM-dd'T'HH:mm") : '',
                sales_end: t.sales_end ? format(new Date(t.sales_end), "yyyy-MM-dd'T'HH:mm") : '',
                // Tambahkan ID sementara jika tidak ada (untuk tiket baru di form)
                id: t.id || Date.now(),
            }))
            : [{ id: Date.now(), name: '', price: '', quota: '', sales_start: '', sales_end: '' }]
    );
    // State untuk genre yang dipilih
    const [selectedGenreIds, setSelectedGenreIds] = useState(initialData.genres ? initialData.genres.map(g => g.id) : []);

    // State untuk daftar opsi (venue, genre)
    const [venueOptions, setVenueOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]); // Tambahan untuk mapping venue ke kota

    // State untuk error
    const [errors, setErrors] = useState({});
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoadingOptions(true);
            try {
                const [venuesRes, genresRes, citiesRes] = await Promise.all([
                    apiClient.get('/venues'),
                    apiClient.get('/genres'),
                    apiClient.get('/cities'), // Ambil data kota
                ]);
                setVenueOptions(venuesRes.data.data);
                setGenreOptions(genresRes.data.data);
                setCityOptions(citiesRes.data.data); // Simpan data kota
            } catch (err) {
                console.error("Gagal mengambil opsi venue/genre/city:", err);
                alert("Gagal memuat daftar venue, genre, atau kota. Silakan refresh halaman.");
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    // Helper untuk mendapatkan nama kota dari ID kota di venue
    const getCityNameById = (cityId) => {
        const city = cityOptions.find(c => c.id === cityId);
        return city ? city.name : 'Unknown City';
    };

    const addTicketRow = () => {
        setTickets([...tickets, { id: Date.now(), name: '', price: '', quota: '', sales_start: '', sales_end: '' }]);
    };

    const removeTicketRow = (idToRemove) => {
        setTickets(tickets.filter(ticket => ticket.id !== idToRemove));
    };

    const handleTicketChange = (idToUpdate, field, value) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === idToUpdate ? { ...ticket, [field]: value } : ticket
            )
        );
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenreIds(prevSelected => {
            if (prevSelected.includes(genreId)) {
                return prevSelected.filter(id => id !== genreId);
            } else {
                return [...prevSelected, genreId];
            }
        });
    };

    const handleFileChange = (e, setFileState, setUrlState) => {
        const file = e.target.files[0];
        setFileState(file);
        if (file) {
            // Untuk menampilkan preview, bisa menggunakan URL.createObjectURL(file)
            // Tapi untuk saat ini, kita hanya menyimpan file objectnya saja.
            setUrlState(''); // Hapus URL yang ada saat file baru dipilih
        }
    };

    const validateForm = () => {
        let newErrors = {};

        // Validasi Konser
        if (!name.trim()) newErrors.name = 'Nama konser harus diisi.';
        if (!venueId) newErrors.venue = 'Venue harus dipilih.';
        if (!concertStart) newErrors.concertStart = 'Waktu mulai konser harus diisi.';
        if (!concertEnd) newErrors.concertEnd = 'Waktu selesai konser harus diisi.';

        if (concertStart && concertEnd) {
            if (new Date(concertStart).getTime() >= new Date(concertEnd).getTime()) {
                newErrors.concertEnd = 'Waktu selesai konser harus setelah waktu mulai.';
            }
        }

        // Validasi Link Gambar (hanya jika mode tambah atau file baru dipilih di mode edit)
        if (initialData.id) { // Mode Edit
            if (!linkPosterFile && !currentLinkPosterUrl) newErrors.linkPoster = 'Poster konser harus diupload atau sudah ada.';
            if (!linkVenueFile && !currentLinkVenueUrl) newErrors.linkVenue = 'Gambar venue harus diupload atau sudah ada.';
        } else { // Mode Tambah
            if (!linkPosterFile) newErrors.linkPoster = 'Poster konser harus diupload.';
            if (!linkVenueFile) newErrors.linkVenue = 'Gambar venue harus diupload.';
        }

        // Validasi Genre
        if (selectedGenreIds.length === 0) newErrors.genres = 'Pilih setidaknya satu genre.';

        // Validasi Tiket
        const ticketErrors = tickets.map((ticket, index) => {
            let errorsForTicket = {};
            if (!ticket.name.trim()) errorsForTicket.name = 'Nama tiket harus diisi.';
            if (!ticket.price || parseInt(ticket.price) <= 0) errorsForTicket.price = 'Harga harus angka positif.';
            if (!ticket.quota || parseInt(ticket.quota) <= 0) errorsForTicket.quota = 'Kuota harus angka positif.';
            if (!ticket.sales_start) errorsForTicket.sales_start = 'Waktu mulai penjualan harus diisi.';
            if (!ticket.sales_end) errorsForTicket.sales_end = 'Waktu selesai penjualan harus diisi.';

            if (ticket.sales_start && ticket.sales_end) {
                if (new Date(ticket.sales_start).getTime() >= new Date(ticket.sales_end).getTime()) {
                    errorsForTicket.sales_end = 'Waktu selesai penjualan harus setelah waktu mulai.';
                }
            }

            if (concertStart && ticket.sales_start && ticket.sales_end) {
                const concertStartTime = new Date(concertStart).getTime();
                const ticketSalesEndTime = new Date(ticket.sales_end).getTime();

                if (ticketSalesEndTime > concertStartTime) {
                    errorsForTicket.sales_end = 'Penjualan tiket harus berakhir sebelum konser dimulai.';
                }
            }

            return Object.keys(errorsForTicket).length > 0 ? errorsForTicket : null;
        });

        if (ticketErrors.some(err => err !== null)) {
            newErrors.tickets = ticketErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            const concertPayload = {
                name,
                description,
                concert_start: concertStart,
                concert_end: concertEnd,
                venue_id: parseInt(venueId),
                genre_ids: selectedGenreIds, // Array of IDs
            };

            const ticketPayloads = tickets.map(t => ({
                id: t.id, // ID dibutuhkan untuk update/delete tiket yang sudah ada
                name: t.name,
                price: parseInt(t.price),
                quota: parseInt(t.quota),
                sales_start: t.sales_start,
                sales_end: t.sales_end,
            }));

            // Kirim data ke parent component
            onSubmit(initialData.id, concertPayload, ticketPayloads, linkPosterFile, linkVenueFile);
        } else {
            console.log('Validasi gagal:', errors);
            // Anda bisa menambahkan logic untuk scroll ke error pertama
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                document.getElementById(firstErrorField)?.focus();
            }
        }
    };

    if (loadingOptions) {
        return <div className="text-center p-4">Memuat pilihan venue dan genre...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{initialData.id ? 'Edit Konser' : 'Tambah Konser Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Konser */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Konser</label>
                    <input
                        type="text"
                        id="name"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${errors.name ? 'border-red-500' : ''}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                {/* Venue */}
                <div>
                    <label htmlFor="venueId" className="block text-sm font-medium text-gray-700">Venue</label>
                    <select
                        id="venueId"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${errors.venue ? 'border-red-500' : ''}`}
                        value={venueId}
                        onChange={(e) => setVenueId(e.target.value)}
                    >
                        <option value="">Pilih Venue</option>
                        {venueOptions.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                                {venue.name} ({getCityNameById(venue.city_id)})
                            </option>
                        ))}
                    </select>
                    {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
                </div>
                {/* Waktu Mulai */}
                <div>
                    <label htmlFor="concertStart" className="block text-sm font-medium text-gray-700">Waktu Mulai Konser</label>
                    <input
                        type="datetime-local"
                        id="concertStart"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${errors.concertStart ? 'border-red-500' : ''}`}
                        value={concertStart}
                        onChange={(e) => setConcertStart(e.target.value)}
                    />
                    {errors.concertStart && <p className="text-red-500 text-xs mt-1">{errors.concertStart}</p>}
                </div>
                {/* Waktu Selesai */}
                <div>
                    <label htmlFor="concertEnd" className="block text-sm font-medium text-gray-700">Waktu Selesai Konser</label>
                    <input
                        type="datetime-local"
                        id="concertEnd"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${errors.concertEnd ? 'border-red-500' : ''}`}
                        value={concertEnd}
                        onChange={(e) => setConcertEnd(e.target.value)}
                    />
                    {errors.concertEnd && <p className="text-red-500 text-xs mt-1">{errors.concertEnd}</p>}
                </div>
                {/* Link Poster (File Input) */}
                <div>
                    <label htmlFor="linkPosterFile" className="block text-sm font-medium text-gray-700">Poster Konser</label>
                    <input
                        type="file"
                        id="linkPosterFile"
                        name="linkPosterFile"
                        onChange={(e) => handleFileChange(e, setLinkPosterFile, setCurrentLinkPosterUrl)}
                        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors.linkPoster ? 'border-red-500' : ''}`}
                    />
                    {currentLinkPosterUrl && !linkPosterFile && (
                        <p className="text-xs text-gray-500 mt-1">File saat ini: <a href={currentLinkPosterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lihat Poster</a></p>
                    )}
                    {errors.linkPoster && <p className="text-red-500 text-xs mt-1">{errors.linkPoster}</p>}
                </div>
                {/* Link Venue (File Input) */}
                <div>
                    <label htmlFor="linkVenueFile" className="block text-sm font-medium text-gray-700">Gambar Venue</label>
                    <input
                        type="file"
                        id="linkVenueFile"
                        name="linkVenueFile"
                        onChange={(e) => handleFileChange(e, setLinkVenueFile, setCurrentLinkVenueUrl)}
                        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors.linkVenue ? 'border-red-500' : ''}`}
                    />
                    {currentLinkVenueUrl && !linkVenueFile && (
                        <p className="text-xs text-gray-500 mt-1">File saat ini: <a href={currentLinkVenueUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lihat Venue</a></p>
                    )}
                    {errors.linkVenue && <p className="text-red-500 text-xs mt-1">{errors.linkVenue}</p>}
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
                ></textarea>
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
                {errors.genres && <p className="text-red-500 text-xs mt-1">{errors.genres}</p>}
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
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${errors.tickets && errors.tickets[index] && errors.tickets[index].name ? 'border-red-500' : ''}`}
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                            />
                            {errors.tickets && errors.tickets[index] && errors.tickets[index].name && <p className="text-red-500 text-xs mt-1">{errors.tickets[index].name}</p>}
                        </div>
                        {/* Harga */}
                        <div>
                            <label htmlFor={`ticket-price-${ticket.id}`} className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                            <input
                                type="number"
                                id={`ticket-price-${ticket.id}`}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${errors.tickets && errors.tickets[index] && errors.tickets[index].price ? 'border-red-500' : ''}`}
                                value={ticket.price}
                                onChange={(e) => handleTicketChange(ticket.id, 'price', e.target.value)}
                            />
                            {errors.tickets && errors.tickets[index] && errors.tickets[index].price && <p className="text-red-500 text-xs mt-1">{errors.tickets[index].price}</p>}
                        </div>
                        {/* Quota */}
                        <div>
                            <label htmlFor={`ticket-quota-${ticket.id}`} className="block text-sm font-medium text-gray-700">Kuota</label>
                            <input
                                type="number"
                                id={`ticket-quota-${ticket.id}`}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${errors.tickets && errors.tickets[index] && errors.tickets[index].quota ? 'border-red-500' : ''}`}
                                value={ticket.quota}
                                onChange={(e) => handleTicketChange(ticket.id, 'quota', e.target.value)}
                            />
                            {errors.tickets && errors.tickets[index] && errors.tickets[index].quota && <p className="text-red-500 text-xs mt-1">{errors.tickets[index].quota}</p>}
                        </div>
                        {/* Waktu Mulai Penjualan */}
                        <div>
                            <label htmlFor={`ticket-sales-start-${ticket.id}`} className="block text-sm font-medium text-gray-700">Penjualan Mulai</label>
                            <input
                                type="datetime-local"
                                id={`ticket-sales-start-${ticket.id}`}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${errors.tickets && errors.tickets[index] && errors.tickets[index].sales_start ? 'border-red-500' : ''}`}
                                value={ticket.sales_start}
                                onChange={(e) => handleTicketChange(ticket.id, 'sales_start', e.target.value)}
                            />
                            {errors.tickets && errors.tickets[index] && errors.tickets[index].sales_start && <p className="text-red-500 text-xs mt-1">{errors.tickets[index].sales_start}</p>}
                        </div>
                        {/* Waktu Selesai Penjualan */}
                        <div>
                            <label htmlFor={`ticket-sales-end-${ticket.id}`} className="block text-sm font-medium text-gray-700">Penjualan Selesai</label>
                            <input
                                type="datetime-local"
                                id={`ticket-sales-end-${ticket.id}`}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${errors.tickets && errors.tickets[index] && errors.tickets[index].sales_end ? 'border-red-500' : ''}`}
                                value={ticket.sales_end}
                                onChange={(e) => handleTicketChange(ticket.id, 'sales_end', e.target.value)}
                            />
                            {errors.tickets && errors.tickets[index] && errors.tickets[index].sales_end && <p className="text-red-500 text-xs mt-1">{errors.tickets[index].sales_end}</p>}
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
                <Button type="button" variant="default" onClick={addTicketRow} className="mt-4">Tambah Tiket Lain</Button>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="caution" onClick={onCancel}>Batal</Button>
                <Button type="submit" variant="success">{initialData.id ? 'Perbarui Konser' : 'Simpan Konser'}</Button>
            </div>
        </form>
    );
};

export default ConcertForm;