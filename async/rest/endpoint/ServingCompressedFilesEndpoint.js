'use strict'

const __root = `${__dirname.substring(0, __dirname.lastIndexOf('guseyn.com'))}guseyn.com`
const { as } = require(`${__root}/async/core/index`)
const { IfElse } = require(`${__root}/async/logic/index`)
const { UrlOfIncomingMessage, ResponseWithStatusCode, ResponseWithHeader, ResponseWithHeaders, WrittenResponse, EndedResponse } = require(`${__root}/async/http/index`)
const { ReadDataByPath, DoesFileExistSync, IsFile, StatsByPath } = require(`${__root}/async/fs/index`)
const { ResolvedPath, Extname } = require(`${__root}/async/path/index`)
const { Compressed } = require(`${__root}/async/zlib/index`)
const { ByteLength } = require(`${__root}/async/buffer/index`)

const Endpoint = require('./Endpoint')
const FSPathByUrl = require('./../FSPathByUrl')
const MimeTypeForExtension = require('./../MimeTypeForExtension')
const AllowedOrigin = require('./../AllowedOrigin')

class ServingFilesCompressedEndpoint extends Endpoint {
  constructor (regexpUrl, mapper, headers, notFoundEndpoint, allowedOrigins) {
    super(regexpUrl, 'GET')
    this.mapper = mapper
    this.headers = headers
    this.notFoundEndpoint = notFoundEndpoint
    this.allowedOrigins = allowedOrigins
  }

  body (request, response) {
    return new ResolvedPath(
      new FSPathByUrl(
        new UrlOfIncomingMessage(request),
        this.mapper
      )
    ).as('RESOLVED_PATH').after(
      new IfElse(
        new DoesFileExistSync(
          as('RESOLVED_PATH')
        ),
        new IfElse(
          new IsFile(
            new StatsByPath(
              as('RESOLVED_PATH')
            )
          ),
          new Compressed(
            new ReadDataByPath(
              as('RESOLVED_PATH')
            )
          ).as('COMPRESSED_FILE_DATA').after(
            new EndedResponse(
              new WrittenResponse(
                new ResponseWithHeader(
                  new ResponseWithHeaders(
                    new ResponseWithHeader(
                      new ResponseWithHeader(
                        new ResponseWithHeader(
                          new ResponseWithStatusCode(
                            response, 200
                          ),
                          'Content-Length',
                          new ByteLength(
                            as('COMPRESSED_FILE_DATA')
                          )
                        ),
                        'Content-Encoding', 'gzip'
                      ),
                      'Content-Type',
                      new MimeTypeForExtension(
                        new Extname(
                          as('RESOLVED_PATH')
                        )
                      )
                    ),
                    this.headers
                  ),
                  'Access-Control-Allow-Origin',
                  new AllowedOrigin(
                    this.allowedOrigins, request
                  )
                ),
                as('COMPRESSED_FILE_DATA')
              )
            )
          ),
          this.notFoundEndpoint.body(request, response)
        ),
        this.notFoundEndpoint.body(request, response)
      )
    )
  }
}

module.exports = ServingFilesCompressedEndpoint
