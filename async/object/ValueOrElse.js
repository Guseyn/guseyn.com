'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValueOrElse extends AsyncObject {
  constructor (obj, key, elseValue) {
    super(obj, key, elseValue)
  }

  syncCall () {
    return (obj, key, elseValue) => {
      if ((obj === undefined) || (obj === null)) {
        return elseValue
      }
      const value = obj[key]
      if ((value === undefined) || (value === null)) {
        return elseValue
      }
      return value
    }
  }
}

module.exports = ValueOrElse
