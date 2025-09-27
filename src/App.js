import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerOrders from "./pages/CustomerOrders";
import AdminOrders from "./pages/AdminOrders";
import "./App.css";

function App() {
  return (
    <Router>
      <nav
        style={{
          padding: "1rem",
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "1rem",
          textAlign: "center",
        }}      
      >
        <Link to="/customer/orders">Customer Orders</Link> |{" "}
        <Link to="/admin/orders">Admin Orders</Link>
      </nav>
      <Routes>
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/" element={<h2>Welcome! Click a link above</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
