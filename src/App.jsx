// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Concerts from './pages/Concerts';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Transactions from './pages/Transactions';
import VCG from './pages/VenuesCitiesGenres';

// Fungsi untuk memeriksa apakah user adalah admin (berdasarkan localStorage)
const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

// Komponen PrivateRoute untuk mengamankan halaman
const PrivateRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        {/* Rute yang Dilindungi oleh PrivateRoute */}
        <Route
          path="*" // Ini akan mencakup semua rute yang tidak secara eksplisit didefinisikan sebelumnya (misalnya / atau /concerts)
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
                  <Navbar />
                  {/* Nested Routes untuk konten utama */}
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/concerts" element={<Concerts />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/venues-cities-genres" element={<VCG />}/> 
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;