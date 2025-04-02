const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/health',
  method: 'GET',
  headers: {
    'Accept': 'text/plain',
    'Content-Type': 'text/plain'
  }
};

console.log('Testing connection to backend at http://localhost:8081/api/health');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`BODY: ${data}`);
    console.log('Backend connection test completed successfully!');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
