'use strict'

const OnStaticJSFilesChangeEvent = require('./../../../server/events/OnStaticJSFilesChangeEvent')
const { AsyncObject } = require('@cuties/cutie')
const { Assertion } = require('@cuties/assert')
const { Is } = require('@cuties/is')

class InvokedOnStaticJSFilesChangeEvent extends AsyncObject {
  constructor (event, eventType, fileName) {
    super(event, eventType, fileName)
  }

  syncCall () {
    return (event, eventType, fileName) => {
      event(eventType, fileName)
      return event
    }
  }
}

new Assertion(
  new Is(
    new OnStaticJSFilesChangeEvent(),
    Function
  )
).after(
  new Assertion(
    new Is(
      new InvokedOnStaticJSFilesChangeEvent(
        new OnStaticJSFilesChangeEvent(),
        'change', './test/server/files/index.js'
      ),
      Function
    )
  ).after(
    new Assertion(
      new Is(
        new InvokedOnStaticJSFilesChangeEvent(
          new OnStaticJSFilesChangeEvent(),
          'create', 'index.js'
        ),
        Function
      )
    )
  )
).call()
