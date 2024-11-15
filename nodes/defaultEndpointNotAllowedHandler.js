module.exports = async function index({
  stream
}) {
  stream.respond({
    'content-type': 'text/plain',
    ':status': 405
  })
  stream.end('405 Not Allowed')
}
