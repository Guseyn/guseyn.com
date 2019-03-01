const { Unit } = require('@page-libs/unit')

class EmailInputUnit extends Unit {
  constructor (elm) {
    super(elm)
  }

  value () {
    return this.elm.value
  }

  onfocus () {
    this.noHighlight()
  }

  highlightError () {

  }

  noHighlight () {

  }
}

module.exports = EmailInputUnit
