'use strict'

const { as } = require('@cuties/cutie')
const { Value } = require('@cuties/json')
const { ReadDataFromFiles, ReadFilesOfDirectory, WrittenDataToFiles } = require('@cuties/fs')
const { Mapped } = require('@cuties/async')
const { Template } = require('@page-libs/static-generator')
const Config = require('./../../async/Config')
const HtmlFilesFromMdFiles = require('./../async/HtmlFilesFromMdFiles')
const BaseTemplateWrapper = require('./../async/BaseTemplateWrapper')
const JoinedPathMapper = require('./../async/JoinedPathMapper')
const PreviewsOfPosts = require('./../async/PreviewsOfPosts')
const TagPagesByPosts = require('./../async/TagPagesByPosts')

new Config('./config.json').as('config').after(
  new Config('./package.json').as('packageJSON').after(
    new Template(
      new Value(as('config'), 'baseTemplate')
    ).as('baseTemplate').after(
      new ReadFilesOfDirectory(
        new Value(
          as('config'),
          'mdPosts'
        )
      ).as('postFileNames').after(
        new ReadFilesOfDirectory(
          new Value(
            as('config'),
            'mdRusPosts'
          )
        ).as('rusPostFileNames').after(
          new WrittenDataToFiles(
            new Mapped(
              new HtmlFilesFromMdFiles(
                new ReadDataFromFiles(
                  new Mapped(
                    as('postFileNames'),
                    new JoinedPathMapper(
                      new Value(as('config'), 'mdPosts')
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
              new Mapped(
                new HtmlFilesFromMdFiles(
                  new ReadDataFromFiles(
                    new Mapped(
                      as('rusPostFileNames'),
                      new JoinedPathMapper(
                        new Value(as('config'), 'mdRusPosts')
                      )
                    ),
                    { encoding: 'utf8' }
                  ),
                  new Value(
                    as('config'), 'htmlRusPosts'
                  )
                ),
                new BaseTemplateWrapper(
                  as('config'),
                  as('packageJSON'),
                  as('baseTemplate')
                )
              ).as('rusPosts'), { flag: 'w' }
            ).after(
              new WrittenDataToFiles(
                new Mapped(
                  new PreviewsOfPosts(
                    as('posts'),
                    new Value(
                      as('config'),
                      'htmlPostPreviews'
                    ),
                    'posts',
                    'previews',
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
                  new Mapped(
                    new PreviewsOfPosts(
                      as('rusPosts'),
                      new Value(
                        as('config'),
                        'htmlRusPostPreviews'
                      ),
                      'rus-posts',
                      'rus-previews',
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
                    new Mapped(
                      new TagPagesByPosts(
                        as('posts'),
                        'posts',
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
                    new WrittenDataToFiles(
                      new Mapped(
                        new TagPagesByPosts(
                          as('rusPosts'),
                          'rus-posts',
                          new Value(
                            as('config'),
                            'rusTagPages'
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
                          new Mapped(
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
        )
      )
    )
  )
).call()
