'use strict'

const { AsyncObject } = require('@cuties/cutie')
const { PrettyPage, Page, Head, Title, Meta, Body, Script, Style, Link, TemplateWithParams } = require('@page-libs/static-generator')
const { Value } = require('@cuties/json')
const UrlWithVersion = require('./UrlWithVersion')
const TemplateWithVersion = require('./TemplateWithVersion')
const MetaWithKeyWordsByContent = require('./MetaWithKeyWordsByContent')
const TitleText = require('./TitleText')

class BaseTemplateWrapper extends AsyncObject {
  constructor (config, packageJSON, baseTemplate) {
    super(config, packageJSON, baseTemplate)
  }

  syncCall () {
    return (config, packageJSON, baseTemplate) => {
      return (path, content) => {
        return new PrettyPage(
          new Page(
            'xmlns="http://www.w3.org/1999/xhtml" lang="en"',
            new Head(
              new Meta('charset="UTF-8"'),
              new Meta('name="viewport" content="width=device-width, initial-scale=1"'),
              new Meta('name="author" content="Guseyn"'),
              new Meta('name="description" content="This blog is mostly expression of my ideas on different things in programming and IT culture"'),
              new Meta(
                new MetaWithKeyWordsByContent(
                  'guseyn, fan of yours, blog, IT, programming, coding, tech, culture, ideas',
                  content
                )
              ),
              new Meta('name="google-site-verification" content="vGxE5xshQhWEvbfiGVWZ4qmfLx_1WW8P82ZW0RP0mwg"'),
              new Title(
                new TitleText(path, content)
              ),
              new Link('rel="shortcut icon" type="image/png" href="/../image/favicon.png"'),
              new Style('https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i|Source+Sans+Pro:400,400i,700,700i', 'type="text/css"'),
              new Style(
                new UrlWithVersion(
                  '/../css/normalize.css',
                  new Value(
                    packageJSON, 'version'
                  )
                ),
                'type="text/css"'
              ),
              new Style(
                new UrlWithVersion(
                  '/../css/main.css',
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'type="text/css"'
              ),
              new Style(
                new UrlWithVersion(
                  '/../css/main-night.css',
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'disabled id="main-night" type="text/css"'
              ),
              new Style(
                new UrlWithVersion(
                  '/../css/github-gist.css',
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'type="text/css"'
              ),
              new Style(
                new UrlWithVersion(
                  '/../css/github-gist-night.css',
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'disabled id="github-gist-night" type="text/css"'
              ),
              new Script(
                new UrlWithVersion(
                  new Value(
                    config,
                    'minBundleHref'
                  ),
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'type="text/javascript"'
              ),
              new Script(
                new UrlWithVersion(
                  '/../js/highlight.pack.js',
                  new Value(
                    packageJSON, 'version'
                  )
                ), 'type="text/javascript"'
              )
            ),
            new Body(
              'class="main"',
              new TemplateWithParams(
                new TemplateWithVersion(
                  baseTemplate,
                  new Value(
                    packageJSON, 'version'
                  )
                ),
                new TemplateWithVersion(
                  content,
                  new Value(
                    packageJSON, 'version'
                  )
                )
              )
            )
          )
        )
      }
    }
  }
}

module.exports = BaseTemplateWrapper
