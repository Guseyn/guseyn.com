'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class ValidMongoObjectId extends AsyncObject {
  constructor (objectId) {
    super(objectId)
  }

  syncCall () {
    return (objectId) => {
      return /^[a-f\d]{24}$/i.test(objectId)
    }
  }
}

module.exports = ValidMongoObjectId
