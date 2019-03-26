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
const PreviewsOfPosts = require('./../PreviewsOfPosts')
const TagPages = require('./../TagPages')

new ParsedJSON(
  new ReadDataByPath('./config.json')
).as('config').after(
  new ParsedJSON(
    new ReadDataByPath('./package.json')
  ).as('packageJSON').after(
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
              )
            ),
            new BaseTemplateWrapper(
              as('config'),
              as('packageJSON'),
              as('baseTemplate')
            )
          ).as('posts'), { flag: 'w' }
        ).after(
          new WrittenDataToFiles(
            new ProcessedObject(
              new PreviewsOfPosts(
                as('posts'),
                new Value(
                  as('config'),
                  'htmlPostPreviews'
                ),
                new Value(
                  as('config'),
                  'postPreviewsPerPage'
                ),
                new Value(
                  as('packageJSON'),
                  'version'
                )
              ),
              new BaseTemplateWrapper(
                as('config'),
                as('packageJSON'),
                as('baseTemplate')
              )
            ), { flag: 'w' }
          ).after(
            new WrittenDataToFiles(
              new ProcessedObject(
                new TagPages(
                  as('posts'),
                  new Value(
                    as('config'),
                    'tagPages'
                  ),
                  new Value(
                    as('packageJSON'),
                    'version'
                  )
                ),
                new BaseTemplateWrapper(
                  as('config'),
                  as('packageJSON'),
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
                      )
                    ),
                    new BaseTemplateWrapper(
                      as('config'),
                      as('packageJSON'),
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
  )
).call()
