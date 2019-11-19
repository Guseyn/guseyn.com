const observer = new MutationObserver(
  (mutationsList, observer) => {
    let done = false
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i]
          if (node.nodeName.toLowerCase() === 'body' && !done) {
            hljs.initHighlightingOnLoad()
            initYoutubeVideos(1.777)
            makeIframesResizable('youtube-video', 1.777)
            makeIframesResizable('soundcloud', 2.185)
            done = true
          }
        }
      }
    }
  }
)
observer.observe(document, { childList: true, subtree: true })
