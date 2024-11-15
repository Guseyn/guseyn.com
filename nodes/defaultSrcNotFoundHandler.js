module.exports = async function index({
  stream
}) {
  stream.respond({
    'content-type': 'text/plain',
    ':status': 404
  })
  stream.end('404 Not Found')
}
