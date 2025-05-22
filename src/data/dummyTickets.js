// src/data/dummyTickets.js
const dummyTickets = [
    {
        id: 1,
        concertId: 1, // Pastikan ini mengacu pada ID konser di dummyConcerts
        name: "Tiket VIP Dewa 19",
        price: 500000,
        quota: 100,
        salesStart: "2025-05-01T08:00:00",
        salesEnd: "2025-06-01T23:59:59",
    },
    {
        id: 2,
        concertId: 1,
        name: "Tiket Reguler Dewa 19",
        price: 250000,
        quota: 300,
        salesStart: "2025-05-01T08:00:00",
        salesEnd: "2025-06-01T23:59:59",
    },
    {
        id: 3,
        concertId: 2, // Pastikan ini mengacu pada ID konser di dummyConcerts
        name: "Tiket Presale Sheila On 7",
        price: 350000,
        quota: 200,
        salesStart: "2025-06-01T09:00:00",
        salesEnd: "2025-06-30T23:59:59",
    },
];

export default dummyTickets;