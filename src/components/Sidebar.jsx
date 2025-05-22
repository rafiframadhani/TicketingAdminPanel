import { Link, useLocation } from "react-router-dom";
import { Home, Music, ReceiptText } from "lucide-react"; 

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-48 bg-gray-900 text-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-8">AdminPanel</h1>
            <ul className="space-y-4">
                <li>
                    <Link
                        to="/"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 ${isActive("/") ? "bg-gray-800" : ""
                            }`}
                    >
                        <Home size={18} /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        to="/concerts"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 ${isActive("/concerts") ? "bg-gray-800" : ""
                            }`}
                    >
                        <Music size={18} /> Konser
                    </Link>
                </li>
                <li>
                    <Link
                        to="/transactions"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 ${isActive("/transactions") ? "bg-gray-800" : ""
                            }`}
                    >
                        <ReceiptText size={18} /> Transaksi
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;