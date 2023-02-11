'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is readable
class ReadableWithErrorEvent extends AsyncObject {
  constructor (stream, event) {
    super(stream, event)
  }

  // event is an Event with body(error)
  syncCall () {
    return (stream, event) => {
      stream.on('error', event)
      return stream
    }
  }
}

module.exports = ReadableWithErrorEvent
