'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is value
class Value extends AsyncObject {
  // path has signature: 'key1.key2.key3[0]'
  constructor (json, path) {
    super(json, path)
  }

  syncCall () {
    return (json, path) => {
      if (path[0] === '[') {
        // eslint-disable-next-line no-eval
        return eval(`json${path}`)
      }
      // eslint-disable-next-line no-eval
      return eval(`json.${path}`)
    }
  }
}

module.exports = Value
