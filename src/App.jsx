import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth.jsx";
import Home from "./components/Home.jsx";
import QRCodeForm from './components/QRCodeForm.jsx';
import About from "./components/About.jsx";
import Navbar from "./components/Navbar.jsx";
import './App.css';

const App = () => {
  const [homeVisible, setHomeVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [qrData, setQrData] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');

  const setUserDetails = (user) => {
    setUsername(user.username);
    setQrData(user.qr_code_data);
    setUniqueNumber(user.unique_number);
  };

  const handleSave = (data) => {
    setQrData(data.qr_code_data);
    setUniqueNumber(data.unique_number);
    console.log('Data saved:', data);
  };

  const handleEdit = (data) => {
    setQrData(data.qr_code_data);
    setUniqueNumber(data.unique_number);
    console.log('Data updated:', data);
  };

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="container">
        <div className="header">
          <h1>SOCIAL-HUB</h1>
          <p>Create and manage your NFC Codes with ease.</p>
          <Navbar />
        </div>
        
        <Routes>
          <Route path="/" element={<Auth setHomeVisible={setHomeVisible} setUserDetails={setUserDetails} />} />
          <Route path="/home" element={<Home username={username} qrData={qrData} uniqueNumber={uniqueNumber} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/qrcode"
            element={
              <QRCodeForm
                userId={1} // Replace with actual userId
                qrData={qrData}
                uniqueNumber={uniqueNumber}
                onSave={handleSave}
                onEdit={handleEdit}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
