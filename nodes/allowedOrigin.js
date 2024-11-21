module.exports = function allowedOrigin(allowedOrigins, requestAuthority) {
  if (allowedOrigins === '*') {
    return '*'
  }
  if (requestAuthority) {
    if (allowedOrigins.indexOf(requestAuthority) !== -1) {
      return allowedOrigins.join(',')
    }
  }
  return null
}
