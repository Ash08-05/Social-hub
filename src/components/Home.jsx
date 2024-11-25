import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const Home = ({username}) => {
 // const [username, setUsername] = useState(''); // Ensure username is set properly
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');
  const [uniqueMessage, setUniqueMessage] = useState('');
  const [qrCodeSrc, setQrCodeSrc] = useState('');

  const generateQR = () => {
    axios.post('http://localhost:3030/generate-link', { username, twitter, instagram, linkedin })
      .then(response => {
        const { combinedLink } = response.data;
        setQrCodeSrc(<QRCodeCanvas value={combinedLink} />);
      })
      .catch(error => {
        console.error('Error generating link:', error);
      });
  };


  const generateUniqueNumber = () => {
    const uniqueNum = Math.floor(Math.random() * 1000000000); // Generate a random 9-digit number
    setUniqueNumber(uniqueNum);
  };

  const saveUniqueNumber = () => {
    axios.post('http://localhost:3030/auth/update', { username, twitter, instagram, linkedin, uniqueNumber })
      .then(response => {
        setUniqueMessage(`Unique Number ${uniqueNumber} saved successfully!`);
      })
      .catch(error => {
        setUniqueMessage(`Error saving unique number: ${error.response ? error.response.data.message : error.message}`);
      });
  };
  const handleUniqueNumberInput = () => {
    axios.post('http://localhost:3030/get-link-by-unique', { uniqueNumber })
      .then(response => {
        const { combinedLink } = response.data;
        setQrCodeSrc(<QRCodeCanvas value={combinedLink} />);
        setUniqueMessage(`Link generated successfully for Unique Number ${uniqueNumber}`);
      })
      .catch(error => {
        setUniqueMessage(`Error retrieving link: ${error.response ? error.response.data.message : error.message}`);
      });
  };


  return (
    <div id="home-section">
      <h2>Welcome to Your Dashboard</h2>
      <h3>Add Your Social Media Links</h3>
      <input 
        type="url" 
        id="twitter" 
        placeholder="Twitter URL"
        value={twitter}
        onChange={(e) => setTwitter(e.target.value)}
      />
      <input 
        type="url" 
        id="instagram" 
        placeholder="Instagram URL"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />
      <input 
        type="url" 
        id="linkedin" 
        placeholder="LinkedIn URL"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
      />
      <button onClick={generateQR}>Generate QR Code</button>
      <button onClick={generateUniqueNumber}>Generate Unique Code</button>
      
      <div id="qrcode" style={{ marginTop: '20px' }}>
        {qrCodeSrc}
      </div>
      <p id="unique-number" style={{ fontSize: '24px' }}>{uniqueNumber}</p>

      <h3>Add Your Unique Number</h3>
      <input 
        type="text" 
        id="uniqueInput" 
        placeholder="Enter Unique Number"
        value={uniqueNumber}
        onChange={(e) => setUniqueNumber(e.target.value)}
      />
      <button onClick={saveUniqueNumber}>Submit Unique Number</button>
      <p id="uniqueMessage">{uniqueMessage}</p>
    </div>
  );
};

export default Home;
