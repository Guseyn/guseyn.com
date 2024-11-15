module.exports = function urlParamsAndQueries(pattern, url) {
  const params = {}
  const queries = {}

  if (!(pattern instanceof RegExp)) {
    const patternParts = pattern.split('?')
    const patternPathParts = patternParts[0].split('/').filter(p => p !== '')
    const patternQueryParts = patternParts[1] ? patternParts[1].split('&').filter(p => p !== '') : []

    const urlParts = url.split('?')
    const urlPathParts = urlParts[0].split('/').filter(p => p !== '')
    const urlQueryParts = urlParts[1] ? urlParts[1].split('&').filter(p => p !== '') : []

    for (let i = 0; i < patternPathParts.length; i++) {
      const patternPathPart = patternPathParts[i]
      const urlPathPart = urlPathParts[i]
      
      if (patternPathPart.startsWith(':') && patternPathPart.length > 1) {
        params[patternPathPart.split(':')[1]] = urlPathPart
      }
    }

    for (let i = 0; i < patternQueryParts.length; i++) {
      const patternQueryPart = patternQueryParts[i]
      const urlQueryPart = urlQueryParts[i]
      
      const urlQueryPartKeyAndValue = urlQueryPart.split('=')
      const urlQueryPartKey = urlQueryPartKeyAndValue[0]
      const urlQueryPartValue = urlQueryPartKeyAndValue[1]
      if (urlQueryPartKey === patternQueryPart && urlQueryPartValue) {
        queries[patternQueryPart] = urlQueryPartValue
      }
    }
  }
  
  return {
    params,
    queries
  }
}