'use strict'

const DayNightButton = require('./DayNightButton')
const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const { HtmlFromMd } = require('@page-libs/md2html')

/* eslint-disable no-new */
window.onload = () => {
  let localStyle = localStorage.getItem('localStyle') || 'day'
  if (localStyle === 'night') {
    document.documentElement.classList.toggle('night')
  }
  new DayNightButton(
    document.getElementById('day-night')
  )
  const cutiesDetailsBox = document.getElementById('cuties-details')
  if (cutiesDetailsBox) {
    new ElementWithInnerHTML(
      cutiesDetailsBox,
      new HtmlFromMd(
        new ResponseBody(
          new ResponseFromAjaxRequest(
            { url: '/../../md/cuties-details.md', method: 'GET' }
          )
        ),
        { 'tables': true }
      )
    ).call()
  }
  const pageLibsDetailsBox = document.getElementById('page-libs-details')
  if (pageLibsDetailsBox) {
    new ElementWithInnerHTML(
      pageLibsDetailsBox,
      new HtmlFromMd(
        new ResponseBody(
          new ResponseFromAjaxRequest(
            { url: '/../../md/page-libs-details.md', method: 'GET' }
          )
        ),
        { 'tables': true }
      )
    ).call()
  }
}
