'use strict'

const SubscribeForm = require('./SubscribeForm')
const EmailInputUnit = require('./EmailInputUnit')
const AboutInputUnit = require('./AboutInputUnit')
const SubscribeButtonUnit = require('./SubscribeButtonUnit')

/* eslint-disable no-new */
window.onload = () => {
  let localStyle = localStorage.getItem('localStyle') || 'day'
  if (localStyle === 'night') {
    document.documentElement.classList.toggle('night')
  }
  new SubscribeForm(
    document.getElementById('subscribe-form'),
    new EmailInputUnit(document.getElementById('email-input')),
    new AboutInputUnit(document.getElementById('email-input')),
    new SubscribeButtonUnit(document.getElementById('subscribe-button'))
  )
}
