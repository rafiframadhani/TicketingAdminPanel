import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1> {/* Ubah warna judul */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-md shadow-md p-6 border-l-4 border-blue-500"> {/* Tambah border warna */}
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Konser</h2>
                    <p className="text-2xl font-bold text-blue-500">
                        {/* Nanti ambil data dari state atau API */}
                        2
                    </p>
                </div>
                <div className="bg-white rounded-md shadow-md p-6 border-l-4 border-green-500"> {/* Tambah border warna */}
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Tiket Terjual</h2>
                    <p className="text-2xl font-bold text-green-500">
                        {/* Nanti ambil data dari state atau API */}
                        450
                    </p>
                </div>
                <div className="bg-white rounded-md shadow-md p-6 border-l-4 border-indigo-500"> {/* Tambah border warna */}
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Konser Mendatang</h2>
                    <ul className="list-disc pl-5 text-gray-600"> {/* Ubah warna teks list */}
                        <li>Dewa 19 - Surabaya (20 Juni 2025)</li>
                        <li>Sheila On 7 Reunion Tour (10 Juli 2025)</li>
                        {/* Nanti ambil data dari state atau API */}
                    </ul>
                </div>
                {/* Anda bisa menambahkan card informasi lainnya dengan warna berbeda */}
            </div>
        </div>
    );
};

export default Dashboard;