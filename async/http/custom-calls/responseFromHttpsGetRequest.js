'use strict'

const https = require('https')

// err, {statusCode, headers, body} in callback
const responseFromHttpsGetRequest = (options, callback) => {
  https.get(options, (res) => {
    let resObj = {}
    resObj.statusCode = res.statusCode
    resObj.headers = res.headers
    let body = []
    res.on('data', (chunk) => {
      body.push(chunk)
    })
    res.on('end', () => {
      resObj.body = Buffer.concat(body)
      callback(null, resObj)
    })
  }).on('error', (err) => {
    callback(err)
  })
}

module.exports = responseFromHttpsGetRequest
