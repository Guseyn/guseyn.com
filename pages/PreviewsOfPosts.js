'use strict'

const { AsyncObject } = require('@cuties/cutie')
const cheerio = require('cheerio')
const path = require('path')

class PreviewsOfPosts extends AsyncObject {
  constructor (posts, dirToSave, bundleSize, version) {
    super(posts, dirToSave, bundleSize, version)
  }

  syncCall () {
    return (posts, dirToSave, bundleSize, version) => {
      const previews = {}
      const postsLen = Object.keys(posts).length
      const totalPreviewPagesNumber = Math.ceil(postsLen / bundleSize)
      let currentBundleCount = 1
      let previewsCount = 1
      this.sortedPostPathsByDate(posts).forEach((postPath, index) => {
        const postContent = posts[postPath]
        const postLink = `/../posts/${path.basename(postPath, '.html')}?v=${version}`
        const contentDiv = this.contentDiv(postContent)
        const key = path.join(dirToSave, `${previewsCount}.html`)
        previews[key] = previews[key] || ''
        previews[key] += this.previewContent(
          this.title(contentDiv, postLink),
          this.date(contentDiv),
          this.firstParagraph(contentDiv),
          this.continueLink(postLink)
        )
        if (currentBundleCount === bundleSize || index === postsLen - 1) {
          previews[key] += this.pagination(previewsCount, totalPreviewPagesNumber)
          currentBundleCount = 1
          previewsCount += 1
        } else {
          currentBundleCount += 1
        }
      })
      return previews
    }
  }

  sortedPostPathsByDate (posts) {
    return Object.keys(posts).sort((path1, path2) => {
      const content1 = posts[path1]
      const content2 = posts[path2]
      const date1 = Date.parse(cheerio.load(content1)('.content').find('.date').first().text())
      const date2 = Date.parse(cheerio.load(content2)('.content').find('.date').first().text())
      return date1 <= date2 ? 1 : -1
    })
  }

  contentDiv (postContent) {
    return cheerio.load(postContent)('.content').first()
  }

  title (contentDiv, postLink) {
    const title = contentDiv.find('h1').first()
    title.html(`<a href="${postLink}">${title.html()}</a>`)
    return title
  }

  date (contentDiv) {
    return contentDiv.find('.date').first()
  }

  firstParagraph (contentDiv) {
    return contentDiv.find('p').first()
  }

  continueLink (postLink) {
    return `<a class="continue" href="${postLink}">continue...</a>`
  }

  previewContent (title, date, firstParagraph, continueLink) {
    const previewContent = cheerio.load('<div class="preview"></div>')('.preview').first()
    previewContent.append(title)
    previewContent.append(date)
    previewContent.append(firstParagraph)
    previewContent.append(continueLink)
    return previewContent.html()
  }

  pagination (previewsCount, totalPreviewPagesNumber) {
    let prevLink = ''
    let nextLink = ''
    if (previewsCount !== 1) {
      prevLink = `<a class="prev" href="./../previews/${previewsCount - 1}"> << </a>`
    }
    if (previewsCount !== totalPreviewPagesNumber) {
      nextLink = `<a class="next" href="./../previews/${previewsCount + 1}"> >> </a>`
    }
    return `<div class="pagination">${prevLink}<span class="current-page">${previewsCount} / ${totalPreviewPagesNumber}</span>${nextLink}</div>`
  }
}

module.exports = PreviewsOfPosts
