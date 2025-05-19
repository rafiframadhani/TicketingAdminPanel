import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="bg-blue-500 text-white shadow-md px-4 py-3 flex justify-between items-center mb-4 rounded-md">
      <h2 className="text-lg font-semibold">Selamat datang, Admin</h2>
      <div>
        <button
          className="bg-red-700 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;