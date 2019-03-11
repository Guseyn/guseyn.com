function makeIframesResizable (className, proportion) {
  var iframes = document.getElementsByClassName(className)
  window.addEventListener('resize', function(event) {
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i]) {
        iframes[i].width = iframes[i].parentElement.offsetWidth
        iframes[i].height = iframes[i].parentElement.offsetWidth / proportion
      }
    }
  }, { passive: true })
}