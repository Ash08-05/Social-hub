import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setHomeVisible, setUserDetails }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();

  const register = () => {
    axios.post('http://localhost:3030/auth/register', { username, password })
      .then(response => {
        setAuthMessage('User registered successfully');
        setUserDetails(response.data.user);
        setHomeVisible(true);
        navigate('/home'); // Redirect to home page
      })
      .catch(error => {
        const errorMsg = error.response ? error.response.data.message : error.message;
        console.error('Registration error:', errorMsg);
        setAuthMessage(`User Already Exist.`);
      });
  };

  const login = () => {
    axios.post('http://localhost:3030/auth/login', { username, password })
      .then(response => {
        if (response.status === 200) {
          setAuthMessage('Login successful');
          setUserDetails(response.data);
          setHomeVisible(true);
          navigate('/home'); // Redirect to home page
        }
      })
      .catch(error => {
        const errorMsg = error.response ? error.response.data.message : error.message;
        console.error('Login error:', errorMsg);
        setAuthMessage('Incorrect Password or Username');
      });
  };

  return (
    <div id="auth-section">
      <h2>Create an Account or Log In</h2>
      <input 
        type="text" 
        id="username" 
        placeholder="Username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required 
      />
      <input 
        type={showPassword ? 'text' : 'password'} 
        id="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <input 
        type="checkbox" 
        id="show-password" 
        checked={showPassword}
        onChange={() => setShowPassword(!showPassword)}
      /> Show Password
      <button onClick={register}>Create Account</button>
      <button onClick={login}>Log In</button>
      <p id="auth-message">{authMessage}</p>
    </div>
  );
};

export default Auth;
