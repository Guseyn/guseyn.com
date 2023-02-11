'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class PrettyDateByTimestamp extends AsyncObject {
  constructor (timestamp) {
    super(timestamp)
  }

  syncCall () {
    return (timestamp) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(timestamp * 1000).toLocaleDateString('en-US', options)
    }
  }
}

module.exports = PrettyDateByTimestamp
