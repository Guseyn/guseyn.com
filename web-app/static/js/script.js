const observer = new MutationObserver(
  (mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (mutation.target.nodeName.toLowerCase() === 'div' && mutation.target.classList.contains('content')) {
          // eslint-disable-next-line no-undef
          initYoutubeVideos(1.777)
          // eslint-disable-next-line no-undef
          makeIframesResizable('youtube-video', 1.777)
          // eslint-disable-next-line no-undef
          makeIframesResizable('soundcloud', 2.185)
        }
      }
    }
  }
)
observer.observe(document, { childList: true, subtree: true })
