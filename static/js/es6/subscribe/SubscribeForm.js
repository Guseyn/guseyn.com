'use strict'

const { Unit } = require('@page-libs/unit')
const { ResponseFromAjaxRequest } = require('@page-libs/ajax')
const { StringifiedJSON } = require('@cuties/json')
const ShownResultOfSubscribtionAttempt = require('./ShownResultOfSubscribtionAttempt')

class SubscribeForm extends Unit {
  constructor (elm, emailInputUnit, aboutInputUnit, subscribeButtonUnit) {
    super(elm)
    this.emailInputUnit = emailInputUnit
    this.aboutInputUnit = aboutInputUnit
    this.subscribeButtonUnit = subscribeButtonUnit
    this.override(this.subscribeButtonUnit, 'onclick', this.onsubmit)
  }

  onsubmit () {
    if (this.emailInputUnit.value().trim() !== '' && this.aboutInputUnit.value().trim() !== '') {
      new ShownResultOfSubscribtionAttempt(
        new ResponseFromAjaxRequest({
          url: '/../subscribe',
          method: 'POST'
        },
        new StringifiedJSON({
          'email': this.emailInputUnit.value(),
          'about': this.aboutInputUnit.value()
        })
        ), this
      ).call()
    } else {
      this.highlightError()
    }
  }

  showSuccessMessage () {
    this.elm.parentElement.innerHTML = '<div id="good-response-box">Thanks for subscription. <a href="../../">Back to the main page</a></div>'
  }

  showErrorMessage () {
    this.elm.parentElement.innerHTML += '<div id="bad-response-box">Thanks for subscription. <a href="../../">Back to the main page</a></div>'
  }

  highlightError () {
    if (this.emailInputUnit.value().trim() === '') {
      this.emailInputUnit.highlightError()
    }
    if (this.aboutInputUnit.value().trim() === '') {
      this.aboutInputUnit.highlightError()
    }
  }
}

module.exports = SubscribeForm
