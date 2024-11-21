const addCorsHeadersIfNeeded = require('./addCorsHeadersIfNeeded')

module.exports = function corsHandler({
  stream, headers, useCors,
  allowedOrigins,
  allowedMethods,
  allowedHeaders,
  allowedCredentials,
  maxAge,
  requestAuthority,
  requestMethod,
}) {
  addCorsHeadersIfNeeded(
    headers,
    requestAuthority,
    requestMethod, {
    useCors,
    allowedOrigins,
    allowedMethods,
    allowedHeaders,
    allowedCredentials,
    maxAge
  })
  headers['x-authority', requestAuthority]
  stream.respond(headers)
  stream.end()
}
