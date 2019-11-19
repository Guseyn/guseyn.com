'use strict'

/* eslint-disable no-unused-vars */
window.makeIframesResizable = (className, proportion) => {
  const iframes = document.getElementsByClassName(className)
  window.addEventListener('resize', (event) => {
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i]) {
        iframes[i].width = iframes[i].parentElement.offsetWidth
        iframes[i].height = iframes[i].parentElement.offsetWidth / proportion
      }
    }
  }, { passive: true })
}
