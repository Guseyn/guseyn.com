'use strict'

const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const { HtmlFromMd } = require('@page-libs/md2html')

/* eslint-disable  no-unused-vars */
window.initPagesDetails = () => {
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
