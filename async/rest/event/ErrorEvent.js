'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { Event } = require(`${__root}/async/core/index`)
const InternalServerErrorEndpoint = require('./../endpoint/InternalServerErrorEndpoint')
const InvokedEndpoint = require('./../endpoint/InvokedEndpoint')

class ErrorEvent extends Event {
  constructor (endpoints, request, response) {
    super()
    this.endpoints = endpoints
    this.request = request
    this.response = response
  }

  body (error) {
    let internalServerErrorEndpoint = this.endpoints.find(endpoint => {
      return endpoint instanceof InternalServerErrorEndpoint
    })
    if (internalServerErrorEndpoint) {
      new InvokedEndpoint(
        internalServerErrorEndpoint,
        this.request,
        this.response,
        error
      ).call()
    }
  }
}

module.exports = ErrorEvent
