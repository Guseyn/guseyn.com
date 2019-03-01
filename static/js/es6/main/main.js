'use strict'

const DayNightButton = require('./DayNightButton')

/* eslint-disable no-new */
window.onload = () => {
  let localStyle = localStorage.getItem('localStyle') || 'day'
  if (localStyle === 'night') {
    document.documentElement.classList.toggle('night')
  }
  new DayNightButton(
    document.getElementById('day-night')
  )
}
