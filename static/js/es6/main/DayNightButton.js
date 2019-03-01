'use strict'

const { Unit } = require('@page-libs/unit')

class DayNightButton extends Unit {
  constructor (elm) {
    super(elm)
  }

  onclick () {
    let localStyle = localStorage.getItem('localStyle') || 'day'
    if (localStyle === 'night') {
      localStorage.setItem('localStyle', 'day')
    } else {
      localStorage.setItem('localStyle', 'night')
    }
    location.reload()
  }
}

module.exports = DayNightButton
