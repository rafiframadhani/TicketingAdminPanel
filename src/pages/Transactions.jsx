// src/pages/Transactions.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/Table";
import { Button } from "../components/ui/button";
import apiClient from '../api/axios'; // Import instance Axios

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [ticketsMap, setTicketsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data tiket dari API
  const fetchTickets = async () => {
    try {
      const response = await apiClient.get('/tickets');
      const data = response.data.data;
      const map = {};
      data.forEach(ticket => {
        map[ticket.id] = {
          name: ticket.name,
          price: ticket.price,
          concertName: ticket.concert ? ticket.concert.name : 'N/A'
        };
      });
      setTicketsMap(map);
    } catch (err) {
      console.error("Gagal mengambil tiket:", err);
      setError("Gagal memuat informasi tiket. Coba refresh halaman.");
    }
  };

  // Fungsi untuk mengambil data transaksi dari API
  // Gunakan useCallback untuk mem-memoize fungsi ini
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersResponse = await apiClient.get('/orders');
      const apiData = ordersResponse.data.data;

      const processedTransactions = apiData.map(order => {
        const userDetail = order.user;
        let totalOrderPrice = 0;
        let uniqueConcertNames = new Set();
        let concertNameForDisplay = '-'; // Default value jika tidak ada tiket

        const ticketsInOrder = (order.ticket_orders || []).map(ticketOrderItem => {
          const ticketDetail = ticketsMap[ticketOrderItem.ticket_id];

          let ticketName = 'N/A';
          let ticketPrice = 0;
          let currentTicketConcertName = 'N/A';

          if (ticketDetail) { // Pastikan ticketDetail ditemukan di map
            ticketName = ticketDetail.name;
            ticketPrice = ticketDetail.price;
            currentTicketConcertName = ticketDetail.concertName;
            uniqueConcertNames.add(currentTicketConcertName);
          }

          totalOrderPrice += ticketOrderItem.quantity * ticketPrice;

          return {
            name: ticketName,
            price: ticketPrice,
            quantity: ticketOrderItem.quantity,
          };
        });

        if (uniqueConcertNames.size > 0) {
            concertNameForDisplay = Array.from(uniqueConcertNames).join(', ');
        } else {
            totalOrderPrice = 0;
        }

        return {
          id: order.id,
          orderTime: order.order_time,
          status: order.status,
          username: userDetail ? userDetail.username : 'N/A',
          tickets: ticketsInOrder,
          totalOrderPrice: totalOrderPrice,
          displayConcertName: concertNameForDisplay,
        };
      });

      setTransactions(processedTransactions.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)));
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
      setError("Gagal mengambil data transaksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [ticketsMap]); // Tambahkan ticketsMap sebagai dependency untuk fetchTransactions

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (Object.keys(ticketsMap).length > 0 || error) {
      fetchTransactions();
    }
  }, [ticketsMap, error, fetchTransactions]); // Tambahkan fetchTransactions sebagai dependency

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi dengan ID ${orderId}?`)) {
      try {
        const response = await apiClient.delete(`/orders/${orderId}`);
        console.log(response.data.message);
        alert('Transaksi berhasil dihapus!');
        fetchTransactions();
      } catch (err) {
        console.error("Gagal menghapus transaksi:", err);
        const errorMessage = err.response?.data?.message || 'Gagal menghapus transaksi. Silakan coba lagi.';
        alert(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat transaksi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Transaksi</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Waktu Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Concert Name</TableHead>
              <TableHead>Detail Tiket</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.username}</TableCell>
                <TableCell>
                  {new Date(order.orderTime).toLocaleString('id-ID', {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                  })}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.displayConcertName}</TableCell>
                <TableCell>
                  {order.tickets && order.tickets.length > 0 ? (
                    <ul>
                      {order.tickets.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} x {item.name} (@Rp{item.price.toLocaleString('id-ID')})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>Rp{order.totalOrderPrice.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;