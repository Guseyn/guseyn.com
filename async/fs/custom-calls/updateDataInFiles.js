'use strict'

const fs = require('fs')

const updateDataInFiles = (filesWithData, updateFunction, options, callback) => {
  let countObj = { count: 0 }
  const files = Object.keys(filesWithData)
  if (files.length === 0) {
    callback(null, files)
  }
  files.forEach(file => {
    ((file) => {
      const updatedData = updateFunction(filesWithData[file])
      fs.writeFile(file, updatedData, options, (error, data) => {
        if (error) {
          callback(error)
        } else {
          countObj.count += 1
          if (countObj.count === files.length) {
            callback(null, files)
          }
        }
      })
    })(file)
  })
}

module.exports = updateDataInFiles
