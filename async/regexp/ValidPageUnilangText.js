'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { memorySizeOf, unilangInputIsTooLarge } = require(`${__root}/async/unilang/index`)

class ValidPageUnilangText extends AsyncObject {
  constructor (text) {
    super(text)
  }

  syncCall () {
    return (text) => {
      return !unilangInputIsTooLarge(memorySizeOf(text))
    }
  }
}

module.exports = ValidPageUnilangText
