'use strict'

const path = require('path')
const { AsyncObject, as } = require('@cuties/cutie')
const { ParsedJSON, Value } = require('@cuties/json')
const { ReadDataFromFiles, ReadFilesOfDirectory, WrittenDataToFiles } = require('@cuties/fs')
const { Mapped } = require('@cuties/array-iteration')
const { ProcessedObject, TheSameObjectWithValue } = require('@cuties/object')
const { PrettyPage, Page, Head, Meta, Body, Script, Style, Template, TemplateWithParams } = require('@page-libs/static-generator')
const HtmlFilesFromMdFiles = require('./HtmlFilesFromMdFiles')

class Logged extends AsyncObject {
  constructor(obj) {
    super(obj)
  }

  syncCall() {
    return (obj) => {
      console.log(obj)
      return obj 
    }
  }
}

new ReadFilesOfDirectory(
  './static/md/posts'
).as('postFileNames').after(
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
      (htmlFile, path, content) => {
        new TheSameObjectWithValue(
          htmlFile,
          path,
          new PrettyPage(
            new Page(
              'xmlns="http://www.w3.org/1999/xhtml" lang="en"',
              new Head(
                new Meta('charset="UTF-8"'),
                new Style('/../css/normalize.css', 'type="text/css"'),
                new Style('/../css/main.css', 'type="text/css"'),
                new Script('/../js/bundle.min.js','type="text/javascript"')
              ),
              new Body(
                'class="main"',
                new TemplateWithParams(
                  new Template('./templates/base.html'),
                  content
                )
              )
            )
          )
        ).call()
      }
    ), { flag: 'w' }
  )
).call()
