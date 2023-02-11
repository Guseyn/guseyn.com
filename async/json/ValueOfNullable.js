'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

// Represented result is value or default value if json is null
class ValueOfNullable extends AsyncObject {
  // path has signature: 'key1.key2.key3[0]'
  constructor (json, path, defaultValue) {
    super(json, path, defaultValue)
  }

  syncCall () {
    return (json, path, defaultValue) => {
      if (json === null) {
        return defaultValue
      }
      if (path[0] === '[') {
        // eslint-disable-next-line no-eval
        return eval(`json${path}`)
      }
      // eslint-disable-next-line no-eval
      return eval(`json.${path}`)
    }
  }
}

module.exports = ValueOfNullable
