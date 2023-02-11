'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class PrettyDateByMilliseconds extends AsyncObject {
  constructor (milliseconds) {
    super(milliseconds)
  }

  syncCall () {
    return (milliseconds) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(milliseconds).toLocaleDateString('en-US', options)
    }
  }
}

module.exports = PrettyDateByMilliseconds
