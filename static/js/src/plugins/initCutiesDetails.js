'use strict'

const { ResponseFromAjaxRequest, ResponseBody } = require('@page-libs/ajax')
const { ElementWithInnerHTML } = require('@page-libs/dom')
const { HtmlFromMd } = require('@page-libs/md2html')

/* eslint-disable  no-unused-vars */
window.initCutiesDetails = () => {
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
}
