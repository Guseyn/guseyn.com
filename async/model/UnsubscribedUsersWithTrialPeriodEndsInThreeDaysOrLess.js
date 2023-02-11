'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class UnsubscribedUsersWithTrialPeriodEndsInThreeDaysOrLess extends AsyncObject {
  constructor (unsubscribedUsers, freeTrialPeriodInDays) {
    super(unsubscribedUsers, freeTrialPeriodInDays)
  }

  syncCall () {
    return (unsubscribedUsers, freeTrialPeriodInDays) => {
      const filteredUsers = []
      for (let index = 0; index < unsubscribedUsers.length; index++) {
        const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000
        const freeTrialPeriodInMilliseconds = freeTrialPeriodInDays * 24 * 60 * 60 * 1000
        const freeTrialEndTime = new Date(unsubscribedUsers[index].signupDate).getTime() + freeTrialPeriodInMilliseconds
        const now = new Date().getTime()
        const deltaBetweenFreeTrialEndTimeAndNow = freeTrialEndTime - now
        if ((deltaBetweenFreeTrialEndTimeAndNow <= threeDaysInMilliseconds) && (deltaBetweenFreeTrialEndTimeAndNow > 0)) {
          filteredUsers.push(unsubscribedUsers[index])
        }
      }
      return filteredUsers
    }
  }
}

module.exports = UnsubscribedUsersWithTrialPeriodEndsInThreeDaysOrLess
