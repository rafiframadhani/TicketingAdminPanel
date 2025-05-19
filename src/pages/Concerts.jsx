import { useEffect, useState } from "react";
import dummyConcerts from "../data/dummyConcerts"; // sementara
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/Table";
import { Button } from "../components/ui/button"; // pastikan ada
import AddConcertForm from "../components/AddConcertForm";
import { Link } from "react-router-dom"; // Import Link

export default function Concerts() {
  const [concerts, setConcerts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setConcerts(dummyConcerts); // nanti diganti ke API
  }, []);

  const handleDelete = (id) => {
    setConcerts(concerts.filter((concert) => concert.id !== id));
  };

  const handleAddConcert = (newConcert) => {
    setConcerts([...concerts, newConcert]);
    setIsAdding(false);
    console.log("Konser baru ditambahkan:", newConcert);
    // Di sini nanti kita akan melakukan POST ke API
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Daftar Konser</h1> {/* Ubah warna judul */}
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Tambah Konser</Button> {/* Style tombol tambah */}
      </div>

      {isAdding && (
        <div className="mb-4 p-4 border rounded-md bg-white shadow-md"> {/* Tambah background dan shadow */}
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Tambah Konser Baru</h2>
          <AddConcertForm onAdd={handleAddConcert} />
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => setIsAdding(false)}>Batal</Button> {/* Gunakan varian secondary */}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerts.map((concert) => (
            <TableRow key={concert.id}>
              <TableCell>{concert.id}</TableCell>
              <TableCell>{concert.name}</TableCell>
              <TableCell>{concert.description}</TableCell>
              <TableCell>
                {new Date(concert.concertStart).toLocaleString()} –{" "}
                {new Date(concert.concertEnd).toLocaleString()}
              </TableCell>
              <TableCell>
                <Link to={`/concerts/edit/${concert.id}`} className="mr-2">
                  <Button variant="outline">Edit</Button> {/* Gunakan varian outline */}
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(concert.id)}> {/* Gunakan varian destructive */}
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}