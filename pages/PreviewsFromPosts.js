const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class PreviewsFromPosts extends AsyncObject {
  constructor (posts, dirToSave, bundleSize) {
    super(posts, dirToSave, bundleSize)
  }

  syncCall () {
    return (posts, dirToSave, bundleSize) => {
      const previews = {}
      let currentBundleCount = 0
      let previewsCount = 1
      Object.keys(posts).forEach((postPath) => {
        if (currentBundleCount === bundleSize - 1) {
          currentBundleCount = 0
          previewsCount += 1
        } else {
          currentBundleCount += 1
        }
        const postContent = posts[postPath]
        const $ = cheerio.load(postContent)
        const contentDiv = $('.content').first()
        const title = contentDiv.find('h1').first()
        title.html(`<a href="${postPath}">${title.text()}</a>`)
        const date = contentDiv.find('.date').first()
        const firstParagraph = contentDiv.find('p').first()
        const key = path.join(dirToSave, `previews-${previewsCount}.html`)
        previews[key] = previews[key] || ''
        previews[key] += `${title}${date}${firstParagraph}`
      })
      return previews
    }
  }
}

module.exports = PreviewsFromPosts
