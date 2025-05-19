import { Link, useLocation } from "react-router-dom";
import { Home, Ticket, Music } from "lucide-react";

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
            <ul className="space-y-4">
                <li>
                    <Link
                        to="/"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-500 ${isActive("/") ? "bg-gray-700" : ""
                            }`}
                    >
                        <Home size={18} /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        to="/tickets"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-500 ${isActive("/tickets") ? "bg-gray-700" : ""
                            }`}
                    >
                        <Ticket size={18} /> Tiket
                    </Link>
                </li>
                <li>
                    <Link
                        to="/concerts"
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-500 ${isActive("/concerts") ? "bg-gray-700" : ""
                            }`}
                    >
                        <Music size={18} /> Konser
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
