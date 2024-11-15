module.exports = function http1xhandler(req, res) {
  if (req.httpVersion === "2.0") {
    // Ignore HTTP/2 requests, will be handled by the on("stream", ...) event handler
    // Or, you can answer the HTTP/2 request here, using HTTP/2 features as well
    return
  }

  // Handle HTTP/1x request
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end("Only HTTP/2 is Supported!")
}
