// src/data/dummyOrderDetails.js
const dummyOrderDetails = [
  {
    id: 101,
    userId: 'user-1-uuid', // Mengacu ke dummyUsers
    orderTime: '2025-05-20T10:30:00',
    status: 'PAID',
  },
  {
    id: 102,
    userId: 'user-2-uuid',
    orderTime: '2025-05-21T14:00:00',
    status: 'PENDING',
  },
  {
    id: 103,
    userId: 'user-1-uuid',
    orderTime: '2025-05-21T18:45:00',
    status: 'PAID',
  },
  {
    id: 104,
    userId: 'user-3-uuid', // Admin bisa juga beli tiket
    orderTime: '2025-05-22T09:15:00',
    status: 'CANCELLED',
  },
];

export default dummyOrderDetails;