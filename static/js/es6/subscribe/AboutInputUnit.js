const { Unit } = require('@page-libs/unit')

class AboutInputUnit extends Unit {
  constructor (elm) {
    super(elm)
  }

  value () {
    return this.elm.value
  }

  highlightError () {

  }

  noHighlight () {

  }
}

module.exports = AboutInputUnit
