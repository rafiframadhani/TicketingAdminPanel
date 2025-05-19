import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import dummyTickets from '../data/dummyTickets'; // Import data tiket dummy
import dummyConcerts from '../data/dummyConcerts'; // Import data konser dummy

const EditTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quota, setQuota] = useState('');
    const [salesStart, setSalesStart] = useState('');
    const [salesEnd, setSalesEnd] = useState('');
    const [concertId, setConcertId] = useState('');
    const [concertOptions, setConcertOptions] = useState([]);

    useEffect(() => {
        // Simulasi pengambilan data tiket berdasarkan ID
        const fetchedTicket = dummyTickets.find((t) => t.id === parseInt(id));
        if (fetchedTicket) {
            setTicket(fetchedTicket);
            setName(fetchedTicket.name);
            setPrice(fetchedTicket.price);
            setQuota(fetchedTicket.quota);
            setSalesStart(fetchedTicket.salesStart);
            setSalesEnd(fetchedTicket.salesEnd);
            setConcertId(fetchedTicket.concertId);
        } else {
            // Redirect ke halaman tiket jika ID tidak valid
            navigate('/tickets');
        }

        // Simulasi pengambilan daftar konser untuk dropdown
        setConcertOptions(dummyConcerts.map(concert => ({
            value: concert.id,
            label: concert.name,
        })));
    }, [id, navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Simulasi update data tiket
        const updatedTicket = {
            ...ticket,
            name,
            price: parseInt(price),
            quota: parseInt(quota),
            salesStart,
            salesEnd,
            concertId: parseInt(concertId),
            // Tambahkan field lain yang bisa diedit
        };
        console.log('Data tiket yang diupdate:', updatedTicket);
        // Di sini nanti kita akan melakukan PUT/PATCH ke API

        // Setelah berhasil diupdate, redirect ke halaman daftar tiket
        navigate('/tickets');
    };

    const handleCancel = () => {
        navigate('/tickets');
    };

    if (!ticket) {
        return <div>Loading...</div>; // Tampilkan pesan loading
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Konser</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-md shadow-md p-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Tiket</label>
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
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Harga</label>
                    <input
                        type="number"
                        id="price"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quota" className="block text-sm font-medium text-gray-700">Quota</label>
                    <input
                        type="number"
                        id="quota"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={quota}
                        onChange={(e) => setQuota(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="salesStart" className="block text-sm font-medium text-gray-700">Waktu Penjualan Mulai</label>
                    <input
                        type="datetime-local"
                        id="salesStart"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={salesStart}
                        onChange={(e) => setSalesStart(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="salesEnd" className="block text-sm font-medium text-gray-700">Waktu Penjualan Selesai</label>
                    <input
                        type="datetime-local"
                        id="salesEnd"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={salesEnd}
                        onChange={(e) => setSalesEnd(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="concertId" className="block text-sm font-medium text-gray-700">Konser</label>
                    <select
                        id="concertId"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={concertId}
                        onChange={(e) => setConcertId(e.target.value)}
                        required
                    >
                        <option value="">Pilih Konser</option>
                        {concertOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <Button type="button" className="mr-2" variant="secondary" onClick={handleCancel}>Batal</Button> {/* Gunakan varian secondary */}
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Simpan Perubahan</Button> {/* Style tombol simpan */}
                </div>
            </form>
        </div>
    );
};
export default EditTicket;