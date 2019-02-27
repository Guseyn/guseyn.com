'use strict'

const { as } = require('@cuties/cutie')
const { ParsedJSON, Value } = require('@cuties/json')
const { ReadDataByPath, ReadDataFromFiles, ReadFilesOfDirectory, WrittenDataToFiles } = require('@cuties/fs')
const { Mapped } = require('@cuties/array-iteration')
const { ProcessedObject } = require('@cuties/object')
const { Template } = require('@page-libs/static-generator')
const HtmlFilesFromMdFiles = require('./../HtmlFilesFromMdFiles')
const BaseTemplateWrapper = require('./../BaseTemplateWrapper')
const JoinedPathMapper = require('./../JoinedPathMapper')
const PreviewsFromPosts = require('./../PreviewsFromPosts')
const TagsFromPosts = require('./../TagsFromPosts')

new ParsedJSON(
  new ReadDataByPath('./config.json')
).as('config').after(
  new ReadFilesOfDirectory(
    new Value(
      as('config'),
      'mdPosts'
    )
  ).as('postFileNames').after(
    new Template(
      new Value(
        as('config'),
        'baseTemplate'
      )
    ).as('baseTemplate').after(
      new WrittenDataToFiles(
        new ProcessedObject(
          new HtmlFilesFromMdFiles(
            new ReadDataFromFiles(
              new Mapped(
                as('postFileNames'),
                new JoinedPathMapper(
                  new Value(
                    as('config'), 'mdPosts'
                  )
                )
              ),
              { encoding: 'utf8' }
            ),
            new Value(
              as('config'), 'htmlPosts'
            ),
            as('postFileNames')
          ),
          new BaseTemplateWrapper(
            as('baseTemplate')
          )
        ).as('posts'), { flag: 'w' }
      ).after(
        new WrittenDataToFiles(
          new ProcessedObject(
            new PreviewsFromPosts(
              as('posts'),
              new Value(
                as('config'),
                'htmlPostPreviews'
              ),
              new Value(
                as('config'),
                'postPreviewsPerPage'
              )
            ),
            new BaseTemplateWrapper(
              as('baseTemplate')
            )
          ), { flag: 'w' }
        ).after(
          new WrittenDataToFiles(
            new ProcessedObject(
              new TagsFromPosts(
                as('posts'),
                new Value(
                  as('config'),
                  'tagPages'
                )
              ),
              new BaseTemplateWrapper(
                as('baseTemplate')
              )
            ), { flag: 'w' }
          ).after(
            new ReadFilesOfDirectory(
              new Value(
                as('config'),
                'mdStuff'
              )
            ).as('stuffFileNames').after(
              new WrittenDataToFiles(
                new ProcessedObject(
                  new HtmlFilesFromMdFiles(
                    new ReadDataFromFiles(
                      new Mapped(
                        as('stuffFileNames'),
                        new JoinedPathMapper(
                          new Value(
                            as('config'), 'mdStuff'
                          )
                        )
                      ),
                      { encoding: 'utf8' }
                    ),
                    new Value(
                      as('config'), 'htmlStuff'
                    ),
                    as('stuffFileNames')
                  ),
                  new BaseTemplateWrapper(
                    as('baseTemplate')
                  )
                ), { flag: 'w' }
              )
            )
          )
        )
      )
    )
  )
).call()
