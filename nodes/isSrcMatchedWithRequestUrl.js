const isEndpointMatchedWithRequestUrlAndMethod = require('./isEndpointMatchedWithRequestUrlAndMethod')

module.exports = function isSrcMatchedWithRequestUrl(src, requestUrl, requestMethod) {
  return isEndpointMatchedWithRequestUrlAndMethod(src, requestUrl, requestMethod)
}
