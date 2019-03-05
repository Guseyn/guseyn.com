'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { PrettyPage, Page, Head, Title, Meta, Body, Script, Style, Link, TemplateWithParams } = require('@page-libs/static-generator')
const { TheSameObjectWithValue } = require('@cuties/object')
const { Value } = require('@cuties/json')

class BaseTemplateWrapper extends AsyncObject {
  constructor (config, baseTemplate) {
    super(config, baseTemplate)
  }

  syncCall () {
    return (config, baseTemplate) => {
      return (htmlFile, path, content) => {
        new TheSameObjectWithValue(
          htmlFile,
          path,
          new PrettyPage(
            new Page(
              'xmlns="http://www.w3.org/1999/xhtml" lang="en"',
              new Head(
                new Meta('charset="UTF-8"'),
                new Meta('name="viewport" content="width=device-width, initial-scale=1"'),
                new Title('fan of yours'),
                new Link('rel="shortcut icon" type="image/png" href="/../image/favicon.png"'),
                new Style('https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i|Source+Sans+Pro:400,400i,700,700i', 'type="text/css"'),
                new Style('/../css/normalize.css', 'type="text/css"'),
                new Style('/../css/main.css', 'type="text/css"'),
                new Style('/../css/main-night.css', 'type="text/css"'),
                new Style('/../css/github-gist.css', 'type="text/css"'),
                new Style('/../css/github-gist-night.css', 'type="text/css"'),
                new Script(
                  new Value(
                    config,
                    'mainMinBundleHref'
                  ),
                  'type="text/javascript"'
                ),
                new Script('/../js/highlight.pack.js', 'type="text/javascript"'),
                new Script('/../js/youtube.js', 'type="text/javascript"')
              ),
              new Body(
                'class="main"',
                new TemplateWithParams(
                  baseTemplate,
                  content
                )
              )
            )
          )
        ).call()
      }
    }
  }
}

module.exports = BaseTemplateWrapper
