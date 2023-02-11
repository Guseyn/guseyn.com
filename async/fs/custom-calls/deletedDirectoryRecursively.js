'use strict'

const fs = require('fs')
const path = require('path')

const removeEmptyDirs = (dirs, callback, count) => {
  count = count || dirs.length
  fs.rmdir(dirs[count - 1], (error) => {
    if (error) {
      callback(error)
    } else {
      if (count === 1) {
        callback(null, dirs[0])
      } else {
        removeEmptyDirs(dirs, callback, count - 1)
      }
    }
  })
}

// returns array of dir(root)
const deletedDirectoryRecursively = (dir, options, callback, removingDirs, dirsCountObj) => {
  removingDirs = removingDirs || []
  dirsCountObj = dirsCountObj || { count: 1 }
  removingDirs.push(dir)
  fs.readdir(dir, options, (error, files) => {
    if (error) {
      callback(error)
    } else {
      let filesCountObj = { count: 0 }
      if (files.length === 0) {
        dirsCountObj.count -= 1
        if (dirsCountObj.count === 0) {
          removeEmptyDirs(removingDirs, callback)
        }
      }
      files.forEach(file => {
        ((file) => {
          let fullFilePath = path.join(dir, file)
          fs.stat(fullFilePath, (error, stats) => {
            if (error) {
              callback(error)
            } else {
              if (stats.isDirectory()) {
                filesCountObj.count += 1
                dirsCountObj.count += 1
                if (filesCountObj.count === files.length) {
                  dirsCountObj.count -= 1
                }
                deletedDirectoryRecursively(fullFilePath, options, callback, removingDirs, dirsCountObj)
              } else if (stats.isFile()) {
                fs.unlink(fullFilePath, (error) => {
                  if (error) {
                    callback(error)
                  } else {
                    filesCountObj.count += 1
                    if (filesCountObj.count === files.length) {
                      dirsCountObj.count -= 1
                      if (dirsCountObj.count === 0) {
                        removeEmptyDirs(removingDirs, callback)
                      }
                    }
                  }
                })
              }
            }
          })
        })(file)
      })
    }
  })
}

module.exports = deletedDirectoryRecursively
