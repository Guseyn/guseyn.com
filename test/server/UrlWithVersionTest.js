'use strict'

const { StrictEqualAssertion } = require('@cuties/assert')
const UrlWithVersion = require('./../../server/UrlWithVersion')

new StrictEqualAssertion(
  new UrlWithVersion('/url', '1.0.0'),
  '/url?v=1.0.0'
).call()
