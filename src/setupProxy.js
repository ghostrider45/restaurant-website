const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware for Java backend...');

  // Proxy API requests to the Java backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        // Send a more helpful error response
        if (res.writeHead && !res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
        }
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Add any authentication headers if needed
        // proxyReq.setHeader('Authorization', `Bearer ${token}`);
        console.log('Proxy Request to Java backend:', req.method, req.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response from Java backend:', proxyRes.statusCode);
      }
    })
  );
};


