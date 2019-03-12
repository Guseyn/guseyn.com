'use strict'

const UrlWithVersion = require('./../../../server/async/UrlWithVersion')
const { StrictEqualAssertion } = require('@cuties/assert')

new StrictEqualAssertion(
  new UrlWithVersion('/url', '1.0.0'),
  '/url?v=1.0.0'
).call()
