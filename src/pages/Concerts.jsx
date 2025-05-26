// src/pages/Concerts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ConcertForm from '../components/ConcertForm';
import apiClient from '../api/axios';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const Concerts = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentConcert, setCurrentConcert] = useState(null);

  // --- State untuk Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationLinks, setPaginationLinks] = useState([]);

  // Fetch Data (Concerts) dengan Pagination - Menggunakan useCallback
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const concertsResponse = await apiClient.get(`/concerts?page=${page}&limit=${itemsPerPage}`);

      const responseData = concertsResponse.data.data;
      setConcerts(responseData.data);
      setCurrentPage(responseData.current_page);
      setTotalItems(responseData.total);
      setTotalPages(responseData.last_page);
      setPaginationLinks(responseData.links);

    } catch (err) {
      console.error("Gagal mengambil data konser:", err);
      setError("Gagal mengambil data konser. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]); // itemsPerPage sebagai dependency

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

  const handleAddConcertClick = () => {
    setCurrentConcert({});
    setShowFormModal(true);
  };

  const handleEditConcertClick = (concert) => {
    setCurrentConcert(concert);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setCurrentConcert(null);
    fetchData(currentPage);
  };

  const handleSubmitConcertForm = async (
    concertId,
    concertPayload,
    ticketPayloads,
    linkPosterFile,
    linkVenueFile
  ) => {
    setLoading(true);
    try {
      let concertResponse;
      const formData = new FormData();

      for (const key in concertPayload) {
        if (key === 'genre_ids' && Array.isArray(concertPayload[key])) {
          concertPayload[key].forEach(id => formData.append('genre_ids[]', id));
        } else {
          formData.append(key, concertPayload[key]);
        }
      }

      if (linkPosterFile) {
        formData.append('link_poster', linkPosterFile);
      }
      if (linkVenueFile) {
        formData.append('link_venue', linkVenueFile);
      }

      if (concertId) {
        formData.append('_method', 'PUT'); // Penting untuk PUT dengan FormData
        concertResponse = await apiClient.post(`/concerts/${concertId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(concertResponse.data.message || "Konser berhasil diperbarui!");
      } else {
        concertResponse = await apiClient.post('/concerts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(concertResponse.data.message || "Konser berhasil ditambahkan!");
      }

      const updatedConcertId = concertResponse.data.data.id;

      const existingTicketIds = currentConcert && Array.isArray(currentConcert.tickets)
        ? currentConcert.tickets.map(t => t.id)
        : [];
      const ticketsToRemove = existingTicketIds.filter(id => !ticketPayloads.some(tp => tp.id === id));

      for (const ticketId of ticketsToRemove) {
        await apiClient.delete(`/tickets/${ticketId}`);
      }

      for (const ticket of ticketPayloads) {
        const payload = {
          concert_id: updatedConcertId,
          name: ticket.name,
          price: ticket.price,
          quota: ticket.quota,
          sales_start: ticket.sales_start,
          sales_end: ticket.sales_end,
        };
        // Periksa apakah ticket.id sudah ada dan merupakan angka
        if (typeof ticket.id === 'number' && existingTicketIds.includes(ticket.id)) {
          await apiClient.put(`/tickets/${ticket.id}`, payload);
        } else {
          await apiClient.post('/tickets', payload);
        }
      }

      handleCloseFormModal();
    } catch (err) {
      console.error("Gagal memproses konser:", err.response ? err.response.data : err.message);
      alert(err.response?.data?.message || "Gagal menyimpan data konser dan tiket.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConcert = async (concertId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus konser dengan ID ${concertId}? Ini juga akan menghapus semua tiket terkait!`)) {
      setLoading(true);
      try {
        const response = await apiClient.delete(`/concerts/${concertId}`);
        alert(response.data.message || "Konser berhasil dihapus!");
        fetchData(currentPage);
      } catch (err) {
        console.error("Gagal menghapus konser:", err.response ? err.response.data : err.message);
        alert(err.response?.data?.message || "Gagal menghapus konser.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Memuat daftar konser...
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Konser</h1>

      <Button onClick={handleAddConcertClick} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
        Tambah Konser Baru
      </Button>

      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentConcert && Object.keys(currentConcert).length > 0 ? 'Edit Konser' : 'Tambah Konser Baru'}</DialogTitle>
          </DialogHeader>
          <ConcertForm
            initialData={currentConcert}
            onSubmit={handleSubmitConcertForm}
            onCancel={handleCloseFormModal}
          />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">ID</TableHead>
            <TableHead className="w-[250px]">Konser</TableHead>
            <TableHead className="w-[180px]">Waktu</TableHead>
            <TableHead className="w-[120px]">Venue</TableHead> 
            <TableHead className="w-[450px]">Tiket</TableHead> 
            <TableHead className="text-center w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concerts.length > 0 ? (
            concerts.map((concert) => (
              <TableRow key={concert.id}>
                <TableCell className="font-medium">{concert.id}</TableCell>
                <TableCell>
                  <p className="font-bold text-gray-900">{concert.name}</p>
                  {concert.link_poster && (
                    <a href={concert.link_poster} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs block mt-1">
                      Lihat Poster
                    </a>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{concert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Genre: {concert.genres && concert.genres.length > 0
                      ? concert.genres.map(genre => genre.name).join(', ')
                      : 'N/A'}
                  </p>
                </TableCell>
                <TableCell className="text-sm">
                  {/* Perbaikan format tanggal: Menambahkan tahun 'yyyy' */}
                  {concert.concert_start && format(new Date(concert.concert_start), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                  <br />- <br />
                  {concert.concert_end && format(new Date(concert.concert_end), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{concert.venue ? `${concert.venue.name} (${concert.venue.city ? concert.venue.city.name : 'N/A'})` : 'N/A'}</p>
                  {concert.link_venue && (
                    <a href={concert.link_venue} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs block mt-1">
                      Lihat Denah Venue
                    </a>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {concert.tickets && concert.tickets.length > 0 ? (
                    <div className="space-y-1">
                      {concert.tickets.map((ticket) => (
                        <div key={ticket.id} className="border-b last:border-b-0 pb-1 mb-1">
                          <p className="font-medium">{ticket.name}</p>
                          <p className="text-xs text-gray-700">
                            Rp{ticket.price.toLocaleString('id-ID')} / Quota: {ticket.quota}
                          </p>
                          <p className="text-xs text-gray-500">
                            Penjualan: {ticket.sales_start && format(new Date(ticket.sales_start), 'dd MMM yyyy', { locale: idLocale })} - {ticket.sales_end && format(new Date(ticket.sales_end), 'dd MMM yyyy', { locale: idLocale })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'Tidak ada tiket'
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="caution"
                      size="sm"
                      onClick={() => handleEditConcertClick(concert)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteConcert(concert.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Tidak ada data konser.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* --- Komponen Pagination --- */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-6">
          <span className="text-sm text-gray-600 mr-2">
            Menampilkan {concerts.length} dari {totalItems} konser
          </span>
          {paginationLinks.map((link, index) => {
            if (link.url === null && (link.label.includes('Previous') || link.label.includes('Next') || link.label === '...')) {
              if (link.label === '...') return <span key={index} className="px-3 py-1 text-gray-500">...</span>;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  disabled={true}
                  className="text-gray-400 cursor-not-allowed"
                >
                  <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                </Button>
              );
            }

            const pageNumMatch = link.url ? link.url.match(/page=(\d+)/) : null;
            const pageNum = pageNumMatch ? parseInt(pageNumMatch[1], 10) : null;

            if (pageNum === null) return null;

            return (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                size="sm"
                onClick={() => link.url && setCurrentPage(pageNum)}
                className={link.active ? "bg-gray-800 text-white hover:bg-gray-900" : ""}
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Concerts;