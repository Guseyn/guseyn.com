const { AsyncObject } = require('@cuties/cutie')
const { PrettyPage, Page, Head, Meta, Body, Script, Style, Link, TemplateWithParams } = require('@page-libs/static-generator')
const { TheSameObjectWithValue } = require('@cuties/object')

class BaseTemplateWrapper extends AsyncObject {
  constructor (baseTemplate) {
    super(baseTemplate)
  }

  syncCall () {
    return (baseTemplate) => {
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
                new Link('href="https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i|Source+Sans+Pro:400,400i,700,700i" rel="stylesheet"'),
                new Style('/../css/normalize.css', 'type="text/css"'),
                new Style('/../css/main.css', 'type="text/css"'),
                new Style('/../css/main-night.css', 'type="text/css"'),
                new Style('/../css/github-gist.css', 'type="text/css"'),
                new Style('/../css/github-gist-night.css', 'type="text/css"'),
                new Script('/../js/bundle.min.js', 'type="text/javascript"'),
                new Script('/../js/highlight.pack.js', 'type="text/javascript"')
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
