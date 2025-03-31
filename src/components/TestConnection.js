import React, { useEffect, useState } from 'react';

const TestConnection = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Testing backend connection...');
    
    fetch('http://localhost:8081/api/restaurants/health')
      .then(response => {
        console.log('Response received:', response);
        return response.text();
      })
      .then(data => {
        console.log('Data received:', data);
        setStatus(data);
      })
      .catch(error => {
        console.error('Connection error:', error);
        setError(error.message);
        setStatus('Failed');
      });
  }, []);

  return (
    <div className="text-black">
      <div>Backend Connection Status: {status}</div>
      {error && <div className="text-red-500">Error: {error}</div>}
    </div>
  );
};

export default TestConnection;

