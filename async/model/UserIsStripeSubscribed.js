'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class UserIsStripeSubscribed extends AsyncObject {
  constructor (user, freeTrialPeriodInDays) {
    super(user, freeTrialPeriodInDays)
  }

  syncCall () {
    return (user, freeTrialPeriodInDays) => {
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000
      const freeTrialPeriodInMilliseconds = freeTrialPeriodInDays * oneDayInMilliseconds
      const userSignUpDateInMilliseconds = new Date(user.signupDate).getTime()
      const now = new Date().getTime()
      let subscriptionTrialPeriodInDays = 0
      if ((userSignUpDateInMilliseconds + freeTrialPeriodInMilliseconds) >= now) {
        subscriptionTrialPeriodInDays = Math.ceil(((userSignUpDateInMilliseconds + freeTrialPeriodInMilliseconds) - now) / oneDayInMilliseconds)
      }
      return (
        (user.stripeSubscriptionId !== null) ||
        (subscriptionTrialPeriodInDays > 0)
      )
    }
  }
}

module.exports = UserIsStripeSubscribed
