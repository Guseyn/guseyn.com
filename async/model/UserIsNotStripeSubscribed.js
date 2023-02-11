'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class UserIsNotStripeSubscribed extends AsyncObject {
  constructor (user) {
    super(user)
  }

  syncCall () {
    return (user) => {
      return (user.stripeSubscriptionId === null)
    }
  }
}

module.exports = UserIsNotStripeSubscribed
