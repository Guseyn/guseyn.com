'use strict'

const CustomIndexEndpoint = require('./../../../server/endpoints/CustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./../../../server/endpoints/CustomNotFoundEndpoint')
const { IndexEndpoint } = require('@cuties/rest')
const { Assertion } = require('@cuties/assert')
const { Is } = require('@cuties/is')
const { CustomStream, InvokedEndpoint } = require('./../common')

new Assertion(
  new Is(
    new InvokedEndpoint(
      new CustomIndexEndpoint(
        './test/server/files/index.html',
        new CustomNotFoundEndpoint(new RegExp(/^\/not-found/))
      ),
      new CustomStream(),
      new CustomStream()
    ), IndexEndpoint
  )
).call()
