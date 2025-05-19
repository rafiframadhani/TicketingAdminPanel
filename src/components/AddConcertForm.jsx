import React, { useState } from 'react';
import { Button } from './ui/button';

const AddConcertForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [concertStart, setConcertStart] = useState('');
    const [concertEnd, setConcertEnd] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newConcert = {
            id: Date.now(), // Simulasi ID, nanti akan diganti dengan ID dari backend
            name,
            description,
            concertStart,
            concertEnd,
            // Tambahkan field lain sesuai kebutuhan (venueId, linkPoster, dll.)
        };
        onAdd(newConcert);
        // Reset form setelah submit
        setName('');
        setDescription('');
        setConcertStart('');
        setConcertEnd('');
    };

    return (
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
                <Button type="submit">Tambah Konser</Button>
            </div>
        </form>
    );
};

export default AddConcertForm;