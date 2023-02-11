'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fetchBodyOfRequest = require('./custom-calls/fetchBodyOfRequest')

class RequestBody extends AsyncObject {
  constructor (request) {
    super(request)
  }

  asyncCall () {
    return (request, callback) => {
      request.body ? callback(null, request.body) : fetchBodyOfRequest(request, callback)
    }
  }
}

module.exports = RequestBody
