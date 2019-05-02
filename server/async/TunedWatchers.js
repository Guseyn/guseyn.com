'use strict'

const { Value } = require('@cuties/json')
const { WatcherWithEventTypeAndFilenameListener } = require('@cuties/fs')
const OnStaticJSFilesChangeEvent = require('./../events/OnStaticJSFilesChangeEvent')
const OnStaticGeneratorsChangeEvent = require('./../events/OnStaticGeneratorsChangeEvent')
const OnTemplatesChangeEvent = require('./../events/OnTemplatesChangeEvent')

module.exports = class {
  constructor (config) {
    return new WatcherWithEventTypeAndFilenameListener(
      new Value(config, 'staticGenerators'),
      { persistent: true, recursive: true, encoding: 'utf8' },
      new OnStaticGeneratorsChangeEvent(
        new Value(config, 'staticGenerators')
      )
    ).after(
      new WatcherWithEventTypeAndFilenameListener(
        new Value(config, 'templates'),
        { persistent: true, recursive: true, encoding: 'utf8' },
        new OnTemplatesChangeEvent(
          new Value(config, 'staticGenerators')
        )
      ).after(
        new WatcherWithEventTypeAndFilenameListener(
          new Value(config, 'mdFiles'),
          { persistent: true, recursive: true, encoding: 'utf8' },
          new OnTemplatesChangeEvent(
            new Value(config, 'staticGenerators')
          )
        ).after(
          new WatcherWithEventTypeAndFilenameListener(
            new Value(config, 'staticJS'),
            { persistent: true, recursive: true, encoding: 'utf8' },
            new OnStaticJSFilesChangeEvent()
          )
        )
      )
    )
  }
}
