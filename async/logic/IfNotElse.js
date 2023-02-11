'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class IfNotElse extends AsyncObject {
  constructor (statement, actionTree, elseActionTree) {
    super(statement)
    this.actionTree = actionTree
    this.elseActionTree = elseActionTree
  }

  syncCall () {
    return (statement) => {
      if (!statement) {
        this.propagateCache(this.actionTree)
        this.actionTree.call()
      } else {
        this.propagateCache(this.elseActionTree)
        this.elseActionTree.call()
      }
      return statement
    }
  }
}

module.exports = IfNotElse
