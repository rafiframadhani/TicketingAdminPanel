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

export default function Concerts() {
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    setConcerts(dummyConcerts); // nanti diganti ke API
  }, []);

  const handleDelete = (id) => {
    setConcerts(concerts.filter((concert) => concert.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Konser</h1>
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
                <Button variant="outline" className="mr-2">Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(concert.id)}>
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
