import tickets from "../data/dummyTickets";
import dummyConcerts from "../data/dummyConcerts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/Table";
import { Link } from "react-router-dom"; // Import Link
import { Button } from "../components/ui/button"; // Pastikan Button diimport

const getConcertNameById = (id) => {
  const concert = dummyConcerts.find((c) => c.id === id);
  return concert ? concert.name : "Unknown Concert";
};

export default function Tickets() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Tiket</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Tiket</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Quota</TableHead>
            <TableHead>Konser</TableHead>
            <TableHead>Penjualan</TableHead>
            <TableHead>Aksi</TableHead> {/* Tambah kolom aksi */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.name}</TableCell>
              <TableCell>Rp{ticket.price.toLocaleString()}</TableCell>
              <TableCell>{ticket.quota}</TableCell>
              <TableCell>{getConcertNameById(ticket.concertId)}</TableCell>
              <TableCell>
                {new Date(ticket.salesStart).toLocaleDateString()} –{" "}
                {new Date(ticket.salesEnd).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link to={`/tickets/edit/${ticket.id}`} className="mr-2">
                  <Button variant="outline">Edit</Button>
                </Link>
                {/* Tambahkan tombol hapus jika diperlukan */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}