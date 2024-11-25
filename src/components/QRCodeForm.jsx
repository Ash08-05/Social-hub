// QRCodeForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QRCodeForm = ({ userId, qrData, uniqueNumber, onSave, onEdit }) => {
  const [qrCodeData, setQrCodeData] = useState(qrData || '');
  const [uniqueNumberField, setUniqueNumberField] = useState(uniqueNumber || '');

  useEffect(() => {
    setQrCodeData(qrData || '');
    setUniqueNumberField(uniqueNumber || '');
  }, [qrData, uniqueNumber]);

  const handleSave = () => {
    const data = {
      user_id: userId,
      qr_code_data: qrCodeData,
      unique_number: uniqueNumberField
    };
    axios.post('http://localhost:3030/qrcodes', data)
      .then(response => {
        onSave(response.data);
      })
      .catch(error => {
        console.error('Error saving data:', error);
      });
  };

  const handleEdit = () => {
    const data = {
      user_id: userId,
      qr_code_data: qrCodeData,
      unique_number: uniqueNumberField
    };
    axios.put(`http://localhost:3030/qrcodes/${userId}`, data)
      .then(response => {
        onEdit(response.data);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  return (
    <div>
      <h2>QR Code Details</h2>
      <input
        type="text"
        placeholder="QR Code Data"
        value={qrCodeData}
        onChange={(e) => setQrCodeData(e.target.value)}
      />
      <input
        type="text"
        placeholder="Unique Number"
        value={uniqueNumberField}
        onChange={(e) => setUniqueNumberField(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default QRCodeForm;
