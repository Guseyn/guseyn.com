'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const fs = require('fs')

// Represented result is FSWatcher
class WatcherWithEventTypeAndFilenameListener extends AsyncObject {
  /*
    listener is an Event with body(eventType, filename)
  */
  constructor (filename, options, listener) {
    super(filename, options, listener)
  }

  syncCall () {
    return (filename, options, listener) => {
      return fs.watch(filename, options, listener)
    }
  }
}

module.exports = WatcherWithEventTypeAndFilenameListener
