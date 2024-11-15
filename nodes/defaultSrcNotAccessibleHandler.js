module.exports = async function index({
  stream
}) {
  stream.respond({
    'content-type': 'text/plain',
    ':status': 403
  })
  stream.end('404 Not Accessible')
}
