'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)
const { memorySizeOf, howMuchUserShouldReduceSizeOfUnilangInput, unilangInputIsTooLarge } = require(`${__root}/async/unilang/index`)

class ArrayOfPageIndexesWithInvalidUnilangText extends AsyncObject {
  constructor (texts) {
    super(texts)
  }

  syncCall () {
    return (texts) => {
      const invalidPages = []
      texts.forEach((text, index) => {
        const sizeOfUnilangInput = memorySizeOf(text)
        if (typeof text !== 'string') {
          invalidPages.push(`<br>#${index + 1}`)
        } else if (unilangInputIsTooLarge(sizeOfUnilangInput)) {
          invalidPages.push(`<br>page #${index + 1} (try to reduce the size of it in ${howMuchUserShouldReduceSizeOfUnilangInput(sizeOfUnilangInput)} times approximately)`)
        }
      })
      return invalidPages
    }
  }
}

module.exports = ArrayOfPageIndexesWithInvalidUnilangText
