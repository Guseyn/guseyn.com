'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ForEachWithDelay extends AsyncObject {
  constructor (list, func) {
    super(list, func)
  }

  syncCall () {
    return (list, func) => {
      for (let index = 0; index < list.length; index++) {
        setTimeout(() => {
          func(list[index])
        }, index * 1000)
      }
    }
  }
}

module.exports = ForEachWithDelay
