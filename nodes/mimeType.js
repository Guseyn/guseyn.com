const path = require('path')
const mimeTypes = require('./mimeTypes')

module.exports = function mimeType(file) {
  const ext = path.extname(file)
  return mimeTypes[ext.toLowerCase().trim().split('.')[1]] || mimeTypes['txt']
}
