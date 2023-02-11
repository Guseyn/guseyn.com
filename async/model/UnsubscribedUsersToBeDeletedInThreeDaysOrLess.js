'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { AsyncObject } = require(`${__root}/async/core/index`)

class UnsubscribedUsersToBeDeletedInThreeDaysOrLess extends AsyncObject {
  constructor (unsubscribedUsers) {
    super(unsubscribedUsers)
  }

  syncCall () {
    return (unsubscribedUsers) => {
      const filteredUsers = []
      for (let index = 0; index < unsubscribedUsers.length; index++) {
        const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000
        const threeMonthsInMilliseconds = 3 * 30 * 24 * 60 * 60 * 1000
        const deleteTime = new Date(unsubscribedUsers[index].unsubscribedDate).getTime() + threeMonthsInMilliseconds
        const now = new Date().getTime()
        const deltaBetweenDeleteTimeAndNow = deleteTime - now
        if ((deltaBetweenDeleteTimeAndNow <= threeDaysInMilliseconds) && (deltaBetweenDeleteTimeAndNow > 0)) {
          filteredUsers.push(unsubscribedUsers[index])
        }
      }
      return filteredUsers
    }
  }
}

module.exports = UnsubscribedUsersToBeDeletedInThreeDaysOrLess
