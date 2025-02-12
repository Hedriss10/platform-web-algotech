import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import Aside from "./module/components/Aside";
import Header from "./module/components/Header";
import Footer from "./module/components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <Aside />
      <Header />
      <AppRoutes />
      <Footer />
    </Router>
  );
}

export default App;
