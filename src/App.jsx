import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Concerts from "./pages/Concerts";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/concerts" element={<Concerts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
