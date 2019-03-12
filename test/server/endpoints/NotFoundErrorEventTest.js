'use strict'

const NotFoundErrorEvent = require('./../../../server/events/NotFoundErrorEvent')
const CustomNotFoundEndpoint = require('./../../../server/endpoints/CustomNotFoundEndpoint')
const { AsyncObject } = require('@cuties/cutie')
const { Assertion } = require('@cuties/assert')
const { Is } = require('@cuties/is')
const { CustomStream } = require('./../common')

class InvokedNotFoundErrorEvent extends AsyncObject {
  constructor (event) {
    super(event)
  }

  syncCall () {
    return (event) => {
      event()
      return event
    }
  }
}

new Assertion(
  new Is(
    new InvokedNotFoundErrorEvent(
      new NotFoundErrorEvent(
        new CustomNotFoundEndpoint(
          new RegExp(/^\/not-found/),
          './test/server/files/404.html'
        ),
        new CustomStream(),
        new CustomStream()
      )
    ),
    Function
  )
).call()
