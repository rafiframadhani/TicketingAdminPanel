// src/pages/Transactions.jsx
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/Table";

// Import data dummy
import dummyUsers from '../data/dummyUsers';
import dummyOrderDetails from '../data/dummyOrderDetails';
import dummyTicketOrders from '../data/dummyTicketOrders';
import dummyTickets from '../data/dummyTickets'; // Dari dummyTickets.js sebelumnya

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fungsi untuk menggabungkan semua data dummy
        const populateTransactions = () => {
            const populatedOrders = dummyOrderDetails.map(order => {
                const user = dummyUsers.find(u => u.id === order.userId);
                const orderTickets = dummyTicketOrders
                    .filter(to => to.orderDetailId === order.id)
                    .map(ticketOrder => {
                        const ticketDetail = dummyTickets.find(t => t.id === ticketOrder.ticketId);
                        return {
                            ...ticketOrder,
                            ticketName: ticketDetail ? ticketDetail.name : 'N/A',
                            ticketPrice: ticketDetail ? ticketDetail.price : 0,
                            totalItemPrice: (ticketDetail ? ticketDetail.price : 0) * ticketOrder.quantity,
                        };
                    });

                const totalOrderPrice = orderTickets.reduce((sum, item) => sum + item.totalItemPrice, 0);

                return {
                    ...order,
                    username: user ? user.username : 'N/A',
                    email: user ? user.email : 'N/A',
                    tickets: orderTickets,
                    totalOrderPrice: totalOrderPrice,
                };
            });
            setTransactions(populatedOrders);
        };

        populateTransactions();
    }, []); // Run once on component mount

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Daftar Transaksi Tiket</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Order</TableHead>
                        <TableHead>User (Username / Email)</TableHead>
                        <TableHead>Waktu Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Detail Tiket</TableHead>
                        <TableHead>Total Harga</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                <p className="font-medium">{order.username}</p>
                                <span className="text-sm text-gray-600">{order.email}</span>
                            </TableCell>
                            <TableCell>{new Date(order.orderTime).toLocaleString()}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                  `}
                                >
                                    {order.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                {order.tickets && order.tickets.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {order.tickets.map((item) => (
                                            <li key={item.id}>
                                                {item.quantity} x {item.ticketName} (@Rp{item.ticketPrice.toLocaleString()})
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    '-'
                                )}
                            </TableCell>
                            <TableCell className="font-bold">Rp{order.totalOrderPrice.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Transactions;