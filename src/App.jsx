import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; // Asumsi Anda punya halaman Dashboard
import Concerts from './pages/Concerts';
import Tickets from './pages/Tickets';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

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
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
                  <Navbar />
                  <Dashboard /> {/* Tempatkan komponen Dashboard di sini */}
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/concerts"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
                  <Navbar />
                  <Concerts />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
                  <Navbar />
                  <Tickets />
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