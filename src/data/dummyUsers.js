// src/data/dummyUsers.js
const dummyUsers = [
  {
    id: 'user-1-uuid', // Menggunakan UUID sesuai DBML
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword1', // Dalam aplikasi nyata, ini akan di-hash
    birthDate: '1990-01-15',
    isAdmin: false,
    forgotPasswordToken: null,
    forgotPasswordExpired: null,
  },
  {
    id: 'user-2-uuid',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    password: 'hashedpassword2',
    birthDate: '1992-03-22',
    isAdmin: false,
    forgotPasswordToken: null,
    forgotPasswordExpired: null,
  },
  {
    id: 'user-3-uuid',
    username: 'admin_user',
    email: 'admin@example.com',
    password: 'hashedadminpassword',
    birthDate: '1985-07-01',
    isAdmin: true,
    forgotPasswordToken: null,
    forgotPasswordExpired: null,
  },
];

export default dummyUsers;