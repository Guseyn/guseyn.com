'use strict'

const DayNightButton = require('./../units/DayNightButton')

/* eslint-disable no-new */
/* eslint-disable  no-unused-vars */
window.initDayNightButton = () => {
  new DayNightButton(
    document.getElementById('day-night')
  )
}
