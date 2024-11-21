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
    requestAuthority, {
    useCors,
    allowedOrigins,
    allowedMethods,
    allowedHeaders,
    allowedCredentials,
    maxAge
  })
  stream.respond(headers)
  stream.end()
}
