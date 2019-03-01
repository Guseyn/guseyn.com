const { Unit } = require('@page-libs/unit')

class SubscribeButton extends Unit {
  constructor (elm) {
    super(elm)
  }

  onclick () {
    /* it can be defined, but it also can be
         overridden with some other event(in that case this method would be ignored) */
  }
}

module.exports = SubscribeButton
