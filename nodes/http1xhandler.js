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
    ...req.headers,
  }

  // Forward the HTTP/1.x request to the HTTP/2 server
  const http2Request = client.request(headers)

  // Pipe the HTTP/1.x request body to the HTTP/2 server
  req.pipe(http2Request)

  // Handle the HTTP/2 response
  http2Request.on('response', (http2Headers) => {
    // Map HTTP/2 headers back to HTTP/1.x headers
    const statusCode = http2Headers[':status'] || 200
    const headers = { ...http2Headers }
    delete headers[':status'] // Remove pseudo-headers

    // Add custom header to indicate the response was handled by HTTP/1
    headers['X-Handled-By'] = 'http1'

    // Send the response to the HTTP/1.x client
    res.writeHead(statusCode, headers)
    http2Request.pipe(res)
  })

  // Handle errors
  http2Request.on('error', (err) => {
    global.log('Error with HTTP/2 request:', err)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error')
  })

  req.on('error', (err) => {
    global.log('Error with HTTP/1.x request:', err)
    client.destroy()
  })

  // Close the HTTP/2 client after the response
  http2Request.on('close', () => {
    client.close()
  })
}
