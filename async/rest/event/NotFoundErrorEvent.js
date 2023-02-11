'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { Event } = require(`${__root}/async/core/index`)

class NotFoundErrorEvent extends Event {
  constructor (notFoundEndpoint, request, response) {
    super()
    this.notFoundEndpoint = notFoundEndpoint
    this.request = request
    this.response = response
  }

  body (error) {
    this.notFoundEndpoint.body(this.request, this.response, error).call()
  }
}

module.exports = NotFoundErrorEvent
