const allowedOrigin = require('./allowedOrigin')

module.exports = function corsHandler({
  stream, headers,
  allowedOrigins,
  allowedMethods,
  allowedHeaders,
  allowedCredentials,
  maxAge,
  requestOrigin,
  requestHost,
  requestMethod,
}) {
  const responseHeaders = {
    'access-control-allow-origin': allowedOrigin(
      allowedOrigins, requestOrigin, requestHost
    ),
    ':status': 204
  }
  if (allowedMethods) {
    responseHeaders['access-control-allow-methods'] = allowedMethods.join(',')
  } else {
    responseHeaders['access-control-allow-methods'] = 'GET,OPTIONS'
  }
  if (allowedHeaders) {
    responseHeaders['access-control-allow-headers'] = allowedHeaders.join(',')
  } else {
    responseHeaders['access-control-allow-headers'] = '*'
  }
  if (allowedCredentials) {
    responseHeaders['access-control-allow-credentials'] = true
  }
  if (maxAge) {
    responseHeaders['access-control-max-age'] = maxAge
  }
  stream.respond(responseHeaders)
  stream.end()
}
