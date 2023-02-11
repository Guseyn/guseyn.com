'use strict'

const fs = require('fs')

// return object: {fileName1: data1, fileName2: data2, ... }
const readDataFromFiles = (files, options, callback) => {
  let contents = {}
  let countObj = { count: 0 }
  if (files.length === 0) {
    callback(null, contents)
  }
  files.forEach(file => {
    ((file) => {
      fs.readFile(file, options, (error, data) => {
        if (error) {
          callback(error)
        } else {
          contents[file] = data
          countObj.count += 1
          if (countObj.count === files.length) {
            callback(null, contents)
          }
        }
      })
    })(file)
  })
}

module.exports = readDataFromFiles
