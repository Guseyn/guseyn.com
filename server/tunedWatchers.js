'use strict'

const { as } = require('@cuties/cutie')
const { Value } = require('@cuties/json')
const { WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const OnStaticJSFilesChangeEvent = require('./events/OnStaticJSFilesChangeEvent')
const OnStaticGeneratorsChangeEvent = require('./events/OnStaticGeneratorsChangeEvent')
const OnTemplatesChangeEvent = require('./events/OnTemplatesChangeEvent')

module.exports = new WatcherWithEventTypeAndFilenameListener(
  new Value(as('config'), 'staticGenerators'),
  { persistent: true, recursive: true, encoding: 'utf8' },
  new OnStaticGeneratorsChangeEvent(
    new Value(as('config'), 'staticGenerators')
  )
).after(
  new WatcherWithEventTypeAndFilenameListener(
    new Value(as('config'), 'templates'),
    { persistent: true, recursive: true, encoding: 'utf8' },
    new OnTemplatesChangeEvent(
      new Value(as('config'), 'staticGenerators')
    )
  ).after(
    new WatcherWithEventTypeAndFilenameListener(
      new Value(as('config'), 'mdFiles'),
      { persistent: true, recursive: true, encoding: 'utf8' },
      new OnTemplatesChangeEvent(
        new Value(as('config'), 'staticGenerators')
      )
    ).after(
      new WatcherWithEventTypeAndFilenameListener(
        new Value(as('config'), 'staticJS'),
        { persistent: true, recursive: true, encoding: 'utf8' },
        new OnStaticJSFilesChangeEvent()
      )
    )
  )
)
