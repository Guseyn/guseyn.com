const http2 = require('http2')

module.exports = function http1xhandler(req, res) {
  if (req.httpVersion === "2.0") {
    // Ignore HTTP/2 requests; they are handled by the "stream" event
    return
  }

  // Connect to the HTTP/2 server
  const client = http2.connect(`https://${global.config.host}:${global.config.port}`, {
    rejectUnauthorized: false, // Accept self-signed certificates (optional, depending on your setup)
  })

  // Map HTTP/1.x headers to HTTP/2 headers
  const headers = {
    ':method': req.method,
    ':path': req.url,
    ':authority': req.headers.host,
    ...req.headers,
  }

  // Remove HTTP/1.x-specific headers
  delete headers['connection']
  delete headers['host']
  delete headers['upgrade']
  delete headers['keep-alive']
  delete headers['proxy-connection']
  delete headers['transfer-encoding']
  delete headers['upgrade-insecure-requests']

  // Forward the HTTP/1.x request to the HTTP/2 server
  const http2Request = client.request(headers)

  // Pipe the HTTP/1.x request body to the HTTP/2 server
  if (req.method.toUpperCase() !== 'GET') {
    req.pipe(http2Request)
  }

  // Handle the HTTP/2 response
  http2Request.on('response', (http2Headers) => {
    // Map HTTP/2 headers back to HTTP/1.x headers
    const statusCode = http2Headers[':status'] || 200
    const responseHeaders = { ...http2Headers }

    // Remove HTTP/2 pseudo-headers
    delete responseHeaders[':status']
    delete responseHeaders[':method']
    delete responseHeaders[':path']
    delete responseHeaders[':authority']
    delete responseHeaders[':scheme']

    // Add custom header to indicate the response was handled by HTTP/1
    responseHeaders['X-Handled-By'] = 'http1'

    // Send the response to the HTTP/1.x client
    if (res.headersSent) {
      res.writeHead(statusCode, responseHeaders)
    }
    http2Request.pipe(res)
  })

  // Handle errors
  http2Request.on('error', (err) => {
    console.log('Error with HTTP/2 request:', err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
    }
    res.end('Internal Server Error')
  })

  req.on('error', (err) => {
    console.log('Error with HTTP/1.x request:', err)
    client.destroy()
  })

  // Close the HTTP/2 client after the response
  http2Request.on('close', () => {
    client.close()
  })
}
