module.exports = function allowedOrigin(allowedOrigins, requestAuthority) {
  if (allowedOrigins === '*') {
    return '*'
  }
  if (requestAuthority) {
    if (allowedOrigins.indexOf(requestAuthority) !== -1) {
      return requestAuthority
    }
  }
  return null
}
