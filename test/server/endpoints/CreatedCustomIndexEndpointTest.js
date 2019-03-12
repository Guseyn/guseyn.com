'use strict'

const CreatedCustomIndexEndpoint = require('./../../../server/endpoints/CreatedCustomIndexEndpoint')
const CustomNotFoundEndpoint = require('./../../../server/endpoints/CustomNotFoundEndpoint')
const { IndexEndpoint } = require('@cuties/rest')
const { Assertion } = require('@cuties/assert')
const { Is } = require('@cuties/is')

new Assertion(
  new Is(
    new CreatedCustomIndexEndpoint(
      'index.html',
      new CustomNotFoundEndpoint(new RegExp(/^\/not-found/))
    ), IndexEndpoint
  )
).call()
