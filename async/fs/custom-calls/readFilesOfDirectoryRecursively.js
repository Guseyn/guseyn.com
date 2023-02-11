'use strict'

const fs = require('fs')
const path = require('path')

// returns array of files(as paths)
const readFilesOfDirectoryRecursively = (dir, options, callback, retrievedFiles, dirsCountObj) => {
  retrievedFiles = retrievedFiles || []
  dirsCountObj = dirsCountObj || { count: 1 }
  fs.readdir(dir, options, (error, files) => {
    if (error) {
      callback(error)
    } else {
      let filesCountObj = { count: 0 }
      if (files.length === 0) {
        dirsCountObj.count -= 1
        if (dirsCountObj.count === 0) {
          callback(null, retrievedFiles)
        }
      }
      files.forEach(file => {
        ((file) => {
          let fullFilePath = path.join(dir, file)
          fs.stat(fullFilePath, (error, stats) => {
            if (error) {
              callback(error)
            } else {
              filesCountObj.count += 1
              if (stats.isDirectory()) {
                dirsCountObj.count += 1
                if (filesCountObj.count === files.length) {
                  dirsCountObj.count -= 1
                }
                readFilesOfDirectoryRecursively(fullFilePath, options, callback, retrievedFiles, dirsCountObj)
              } else if (stats.isFile()) {
                retrievedFiles.push(fullFilePath)
                if (filesCountObj.count === files.length) {
                  dirsCountObj.count -= 1
                  if (dirsCountObj.count === 0) {
                    callback(null, retrievedFiles)
                  }
                }
              }
            }
          })
        })(file)
      })
    }
  })
}

module.exports = readFilesOfDirectoryRecursively
