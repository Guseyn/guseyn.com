'use strict'

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
      let currentBundleCount = 1
      let previewsCount = 1
      let postsLen = Object.keys(posts).length
      let totalPreviewPagesNumber = Math.ceil(postsLen / bundleSize)
      Object.keys(posts).sort((path1, path2) => {
        const content1 = posts[path1]
        const content2 = posts[path2]
        const date1 = Date.parse(cheerio.load(content1)('.content').find('.date').first().text())
        const date2 = Date.parse(cheerio.load(content2)('.content').find('.date').first().text())
        return date1 <= date2 ? 1 : -1
      }).forEach((postPath, index) => {
        const postContent = posts[postPath]
        const postLink = `/../posts/${path.basename(postPath).split('.')[0]}`
        const contentDiv = cheerio.load(postContent)('.content').first()
        const title = contentDiv.find('h1').first()
        title.html(`<a href="${postLink}">${title.text()}</a>`)
        const date = contentDiv.find('.date').first()
        const firstParagraph = contentDiv.find('p').first()
        const continueLink = `<a class="continue" href="${postLink}">continue...</a>`
        const key = path.join(dirToSave, `${previewsCount}.html`)
        previews[key] = previews[key] || ''
        previews[key] += `${title}${date}${firstParagraph}${continueLink}`
        if (currentBundleCount === bundleSize || index === postsLen - 1) {
          let prevLink = ''
          let nextLink = ''
          if (previewsCount !== 1) {
            prevLink = `<a class="prev" href="./../previews/${previewsCount - 1}"> << </a>`
          }
          if (previewsCount !== totalPreviewPagesNumber) {
            nextLink = `<a class="next" href="./../previews/${previewsCount + 1}"> >> </a>`
          }
          previews[key] += `<div class="pagination">${prevLink}<span class="current-page">${previewsCount} / ${totalPreviewPagesNumber}</span>${nextLink}</div>`
          currentBundleCount = 1
          previewsCount += 1
        } else {
          currentBundleCount += 1
        }
      })
      return previews
    }
  }
}

module.exports = PreviewsFromPosts
