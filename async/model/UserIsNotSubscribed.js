'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class UserIsNotSubscribed extends AsyncObject {
  constructor (user) {
    super(user)
  }

  syncCall () {
    return (user) => {
      return (user.subscribed === false)
    }
  }
}

module.exports = UserIsNotSubscribed
