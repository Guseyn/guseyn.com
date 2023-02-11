'use strict'

const url = require('url')
const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class QueryObjectFromUrl extends AsyncObject {
  constructor (requestUrl) {
    super(requestUrl)
  }

  syncCall () {
    return (requestUrl) => {
      // eslint-disable-next-line node/no-deprecated-api
      return url.parse(requestUrl, true).query
    }
  }
}

module.exports = QueryObjectFromUrl
