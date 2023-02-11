'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class If extends AsyncObject {
  constructor (statement, actionTree) {
    super(statement)
    this.actionTree = actionTree
  }

  syncCall () {
    return (statement) => {
      if (statement) {
        this.propagateCache(this.actionTree)
        this.actionTree.call()
      }
      return statement
    }
  }
}

module.exports = If
