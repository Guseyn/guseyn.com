'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { IfElse } = require(`${__root}/async/logic/index`)
const { UrlOfIncomingMessage, ResponseWithStatusCode, ResponseWithHeader, ResponseWithHeaders } = require(`${__root}/async/http/index`)
const { CreatedReadStream, StatsByPath, Size, DoesFileExistSync, IsFile } = require(`${__root}/async/fs/index`)
const { ResolvedPath, Extname } = require(`${__root}/async/path/index`)
const { PipedReadable, ReadableWithErrorEvent } = require(`${__root}/async/stream/index`)

const Endpoint = require('./Endpoint')
const NotFoundErrorEvent = require('./../event/NotFoundErrorEvent')
const FSPathByUrl = require('./../FSPathByUrl')
const MimeTypeForExtension = require('./../MimeTypeForExtension')

class ServingFilesEndpoint extends Endpoint {
  constructor (regexpUrl, mapper, headers, notFoundEndpoint) {
    super(regexpUrl, 'GET')
    this.mapper = mapper
    this.headers = headers
    this.notFoundEndpoint = notFoundEndpoint
  }

  body (request, response) {
    return new ResolvedPath(
      new FSPathByUrl(
        new UrlOfIncomingMessage(request),
        this.mapper
      )
    ).as('resolvedPath').after(
      new IfElse(
        new DoesFileExistSync(
          as('resolvedPath')
        ),
        new IfElse(
          new IsFile(
            new StatsByPath(
              as('resolvedPath')
            )
          ),
          new PipedReadable(
            new ReadableWithErrorEvent(
              new CreatedReadStream(
                as('resolvedPath')
              ),
              new NotFoundErrorEvent(
                this.notFoundEndpoint, request, response
              )
            ),
            new ResponseWithStatusCode(
              new ResponseWithHeaders(
                new ResponseWithHeader(
                  new ResponseWithHeader(
                    response, 'Content-Type',
                    new MimeTypeForExtension(
                      new Extname(
                        as('resolvedPath')
                      )
                    )
                  ), 'Content-Length',
                  new Size(
                    new StatsByPath(
                      as('resolvedPath')
                    )
                  )
                ), this.headers
              ), 200
            )
          ),
          this.notFoundEndpoint.body(request, response)
        ),
        this.notFoundEndpoint.body(request, response)
      )
    )
  }
}

module.exports = ServingFilesEndpoint
