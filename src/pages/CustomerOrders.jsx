// pages/CustomerOrders.jsx
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography, Grid, Box } from "@mui/material";

function CustomerOrders() {

  //const [orders, setOrders] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1, totalPrice: 120, status: "Pending", items: ["Apple", "Banana"] },
    { id: 2, totalPrice: 450, status: "Delivered", items: ["Bread", "Milk"] },
    { id: 3, totalPrice: 300, status: "Cancelled", items: ["Tomato", "Onion", "Chicken"] },
  ]);
  
  {/*
  useEffect(() => {
    fetch(`http://localhost:8080/api/customers/${customerId}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);
  */}

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";
      case "Pending":
        return "orange";
      case "Cancelled":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items Ordered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>${order.totalPrice}</TableCell>
                <TableCell sx={{ color: getStatusColor(order.status) }}>
                  {order.status}
                </TableCell>
                <TableCell>{order.items.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CustomerOrders;
