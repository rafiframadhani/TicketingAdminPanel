import React, { useState, useEffect } from 'react';
import dummyConcerts, { getVenueById } from '../data/dummyConcerts'; // Import getVenueById
import dummyTickets from '../data/dummyTickets'; // Import dummyTickets
import dummyOrderDetails from '../data/dummyOrderDetails'; // Import dummyOrderDetails
import dummyTicketOrders from '../data/dummyTicketOrders'; // Import dummyTicketOrders
import dummyUsers from '../data/dummyUsers'; // Import dummyUsers
import dummyCities from '../data/dummyCities'; // Import dummyCities

// Helper untuk mendapatkan nama kota dari ID kota di venue
const getCityNameById = (cityId) => {
  const city = dummyCities.find(c => c.id === cityId);
  return city ? city.name : 'Unknown City';
};

const Dashboard = () => {
  const [totalConcerts, setTotalConcerts] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Hitung Total Konser
    setTotalConcerts(dummyConcerts.length);

    // Hitung Total Tiket Terjual dan Total Pendapatan
    let soldCount = 0;
    let revenue = 0;
    dummyTicketOrders.forEach(orderItem => {
      const ticket = dummyTickets.find(t => t.id === orderItem.ticketId);
      if (ticket) {
        soldCount += orderItem.quantity;
        revenue += (orderItem.quantity * ticket.price);
      }
    });
    setTotalTicketsSold(soldCount);
    setTotalRevenue(revenue);

    // Filter Konser Mendatang
    const now = new Date();
    const upcoming = dummyConcerts
      .filter(concert => new Date(concert.concertStart) > now)
      .sort((a, b) => new Date(a.concertStart) - new Date(b.concertStart))
      .slice(0, 3); // Ambil 3 konser mendatang teratas
    setUpcomingConcerts(upcoming);

    // Gabungkan data untuk Transaksi Terbaru
    const populatedTransactions = dummyOrderDetails.map(order => {
      const user = dummyUsers.find(u => u.id === order.userId);
      const orderTickets = dummyTicketOrders
        .filter(to => to.orderDetailId === order.id)
        .map(ticketOrder => {
          const ticketDetail = dummyTickets.find(t => t.id === ticketOrder.ticketId);
          return {
            ...ticketOrder,
            ticketName: ticketDetail ? ticketDetail.name : 'N/A',
            ticketPrice: ticketDetail ? ticketDetail.price : 0,
          };
        });
      const totalOrderPrice = orderTickets.reduce((sum, item) => sum + (item.ticketPrice * item.quantity), 0);

      return {
        ...order,
        username: user ? user.username : 'N/A',
        totalOrderPrice: totalOrderPrice,
        ticketsCount: orderTickets.reduce((sum, item) => sum + item.quantity, 0)
      };
    }).sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime)) // Urutkan dari terbaru
      .slice(0, 5); // Ambil 5 transaksi terbaru

    setLatestTransactions(populatedTransactions);

    // Hitung Total User
    setTotalUsers(dummyUsers.length);

  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

      {/* Baris Card Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Konser</h2>
          <p className="text-3xl font-bold text-blue-600">{totalConcerts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Tiket Terjual</h2>
          <p className="text-3xl font-bold text-green-600">{totalTicketsSold}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Pendapatan</h2>
          <p className="text-3xl font-bold text-purple-600">Rp{totalRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Pengguna</h2>
          <p className="text-3xl font-bold text-orange-600">{totalUsers}</p>
        </div>
      </div>

      {/* Baris Konten Tambahan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Konser Mendatang */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Konser Mendatang</h2>
          {upcomingConcerts.length > 0 ? (
            <ul className="space-y-3">
              {upcomingConcerts.map((concert) => {
                const venue = getVenueById(concert.venueId);
                const cityName = venue ? getCityNameById(venue.cityId) : 'N/A';
                return (
                  <li key={concert.id} className="border-b pb-2 last:border-b-0">
                    <p className="font-medium text-gray-900">{concert.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(concert.concertStart).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} - {cityName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pukul: {new Date(concert.concertStart).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">Tidak ada konser mendatang.</p>
          )}
        </div>

        {/* Transaksi Terbaru */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Transaksi Terbaru</h2>
          {latestTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Tiket
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Harga
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {latestTransactions.map((order) => (
                    <tr key={order.id}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                        {order.username}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                        {order.ticketsCount}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                        Rp{order.totalOrderPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada transaksi terbaru.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;