// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../components/ui/table';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarDays, Ticket,Landmark, Home, MapPin } from 'lucide-react';

// Fungsi helper untuk format mata uang Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States untuk statistik
  const [totalConcerts, setTotalConcerts] = useState(0);
  const [totalCities, setTotalCities] = useState(0); // Diaktifkan kembali
  const [totalVenues, setTotalVenues] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // States untuk preview data
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);

  // Fungsi untuk mengambil semua data dashboard
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // --- Fetch Total Konser ---
      const concertsResponse = await apiClient.get('/concerts?limit=999');
      setTotalConcerts(concertsResponse.data.data.total || concertsResponse.data.data.data.length || 0);

      // --- Fetch Total Kota ---
      const citiesResponse = await apiClient.get('/cities?limit=999');
      setTotalCities(citiesResponse.data.data.total || citiesResponse.data.data.length || 0);

      // --- Hitung Total Venue dari endpoint cities ---
      let calculatedTotalVenues = 0;
      if (citiesResponse.data && Array.isArray(citiesResponse.data.data)) {
        citiesResponse.data.data.forEach(city => {
          if (city.venues && Array.isArray(city.venues)) {
            calculatedTotalVenues += city.venues.length;
          }
        });
      }
      setTotalVenues(calculatedTotalVenues);

      // --- Fetch Tiket Terjual dan Pendapatan (Status "completed") ---
      const ticketOrdersResponse = await apiClient.get('/ticket-orders?limit=999');
      let soldTicketsCount = 0;
      let calculatedRevenue = 0;

      const completedTransactions = ticketOrdersResponse.data.data.filter(
        (order) => order.order_detail?.status === 'completed'
      );

      completedTransactions.forEach((order) => {
        soldTicketsCount += order.quantity;
        calculatedRevenue += order.quantity * (order.ticket?.price || 0);
      });

      setTicketsSold(soldTicketsCount);
      setTotalRevenue(calculatedRevenue);

      // --- Preview Transaksi Terbaru (ambil 5 dari yang completed) ---
      const allTransactions = ticketOrdersResponse.data.data || [];
      const sortedTransactions = [...allTransactions].sort((a, b) =>
        new Date(b.order_detail?.order_time) - new Date(a.order_detail?.order_time)
      );
      setLatestTransactions(sortedTransactions.slice(0, 5));

      // --- Upcoming Concerts ---
      const upcomingConcertsResponse = await apiClient.get('/concerts?upcoming=1');
      setUpcomingConcerts(upcomingConcertsResponse.data.data.data?.slice(0, 5) || []);

    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
      setError("Gagal mengambil data dashboard. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Memuat data dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen"> {/* Tambahkan background pada div utama */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Overview</h1>

      {/* Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-md"> {/* Tambahkan shadow untuk pembeda visual */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Konser</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" /> {/* Ikon dari Lucide */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConcerts}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md"> {/* Tambahkan shadow untuk pembeda visual */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kota</CardTitle> {/* Card baru */}
            <MapPin className="h-4 w-4 text-muted-foreground" /> {/* Ikon dari Lucide */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCities}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md"> {/* Tambahkan shadow untuk pembeda visual */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venue</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" /> {/* Ikon dari Lucide */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVenues}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md"> {/* Tambahkan shadow untuk pembeda visual */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" /> {/* Ikon dari Lucide */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsSold}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md"> {/* Tambahkan shadow untuk pembeda visual */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" /> {/* Ikon dari Lucide */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Preview Transaksi Terbaru dan Upcoming Concerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="col-span-1 shadow-md"> {/* Tambahkan shadow */}
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestTransactions.length > 0 ? (
                  latestTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.order_detail?.transaction_id || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${tx.order_detail?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            tx.order_detail?.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {tx.order_detail?.status || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {tx.order_detail?.order_time ? format(new Date(tx.order_detail.order_time), 'dd MMM, HH:mm', { locale: idLocale }) : 'N/A'}
                      </TableCell>
                      <TableCell>{tx.quantity}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      Tidak ada transaksi terbaru.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md"> {/* Tambahkan shadow */}
          <CardHeader>
            <CardTitle>Konser Mendatang</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Konser</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingConcerts.length > 0 ? (
                  upcomingConcerts.map((concert) => (
                    <TableRow key={concert.id}>
                      <TableCell className="font-medium">{concert.name}</TableCell>
                      <TableCell>{concert.venue?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {concert.concert_start ? format(new Date(concert.concert_start), 'dd MMM, HH:mm', { locale: idLocale }) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                      Tidak ada konser mendatang.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;