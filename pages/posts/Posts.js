'use strict'

const path = require('path')
const { AsyncObject, as } = require('@cuties/cutie')
const { ParsedJSON, Value } = require('@cuties/json')
const { ReadDataFromFiles, ReadFilesOfDirectory, WrittenDataToFiles } = require('@cuties/fs')
const { Mapped } = require('@cuties/array-iteration')
const { ProcessedObject, TheSameObjectWithValue } = require('@cuties/object')
const { PrettyPage, Page, Head, Meta, Body, Script, Style, Link, Template, TemplateWithParams } = require('@page-libs/static-generator')
const HtmlFilesFromMdFiles = require('./HtmlFilesFromMdFiles')

new ReadFilesOfDirectory(
  './static/md/posts'
).as('postFileNames').after(
  new Template(
    './templates/base.html'
  ).as('baseTemplate').after(
    new WrittenDataToFiles(
      new ProcessedObject(
        new HtmlFilesFromMdFiles(
          new ReadDataFromFiles(
            new Mapped(
              as('postFileNames'),
              (fileName) => { return path.join('./static/md/posts', fileName) }
            ),
            { encoding: 'utf8' }
          ),
          './static/html/posts',
          as('postFileNames')
        ),
        (htmlFile, path, content, baseTemplate) => {
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
                  new Script('/../js/bundle.min.js','type="text/javascript"'),
                  new Script('/../js/highlight.pack.js','type="text/javascript"')
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
        },
        as('baseTemplate')
      ), { flag: 'w' }
    )
  )
).call()
