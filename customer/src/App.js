import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerAuth from "./pages/CustomerAuth";
import CustomerOrder from "./pages/CustomerOrder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerAuth />} />
      <Route path="/customer/order" element={<CustomerOrder />} />
    </Routes>
  );
}

export default App;
