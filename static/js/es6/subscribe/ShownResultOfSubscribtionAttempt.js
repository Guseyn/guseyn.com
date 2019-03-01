'use strict'

const { AsyncObject } = require('@cuties/cutie')

class ShownResultOfSubscribtionAttempt extends AsyncObject {
  constructor (response, subscribeForm) {
    super(response, subscribeForm)
  }

  syncCall () {
    return (response, subscribeForm) => {
      if (response.statusCode === 200) {
        subscribeForm.showSuccessMessage()
      } else {
        subscribeForm.showErrorMessage()
      }
    }
  }
}

module.exports = ShownResultOfSubscribtionAttempt
