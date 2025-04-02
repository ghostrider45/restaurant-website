import React, { useEffect, useState } from 'react';

const TestConnection = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  const [backendUrl, setBackendUrl] = useState('');
  const [connectionDetails, setConnectionDetails] = useState({});

  useEffect(() => {
    // Display the backend URL from environment variables
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
    setBackendUrl(apiBaseUrl);

    const testConnection = async () => {
      try {
        console.log('Testing backend connection to:', apiBaseUrl + '/api/health');

        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();

        // Try direct connection first (with CORS headers)
        console.log('Trying direct connection to backend...');
        const response = await fetch(`${apiBaseUrl}/api/health?t=${timestamp}`, {
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        setConnectionDetails({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()])
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        console.log('Data received:', data);
        setStatus(data || 'Connected (no data)');
      } catch (error) {
        console.error('Connection error:', error);
        setError(error.message);
        setStatus('Failed');
      }
    };

    testConnection();

    // Try again after 5 seconds if failed
    const intervalId = setInterval(testConnection, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-black p-4 bg-yellow-100 border border-yellow-300 rounded-md">
      <h3 className="font-bold">Backend Connection Test</h3>
      <div className="mt-2">Status: <span className={status === 'Failed' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{status}</span></div>
      <div className="mt-1">Backend URL: {backendUrl}</div>
      {error && (
        <div className="mt-2">
          <div className="text-red-600 font-semibold">Error: {error}</div>
          <div className="text-sm mt-1">Make sure your backend server is running on {backendUrl}</div>
        </div>
      )}
      {connectionDetails.status && (
        <div className="mt-2 text-xs">
          <details>
            <summary className="cursor-pointer">Connection Details</summary>
            <pre className="mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(connectionDetails, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default TestConnection;




