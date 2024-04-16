'use strict'

window.__ehtmlCustomElements__['youtube-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  const proportion = 1.777
  const youtubePlaceholder = document.createElement('div')
  const id = node.getAttribute('id')
  if (!id) {
    throw new Error('<template is="youtube"> must have id attribute')
  }
  youtubePlaceholder.setAttribute('id', id)
  if (node.hasAttribute('class')) {
    youtubePlaceholder.setAttribute(
      'class',
      node.getAttribute('class')
    )
  }
  youtubePlaceholder.style['background'] = `url(https://img.youtube.com/vi/${id}/maxresdefault.jpg) no-repeat`
  youtubePlaceholder.style['background-size'] = '100% 100%'
  const youtubeButton = document.createElement('img')
  youtubeButton.setAttribute('class', 'youtube-video-play')
  youtubeButton.setAttribute('src', '/image/youtube_64dp.png')
  youtubePlaceholder.appendChild(youtubeButton)
  youtubePlaceholder.onclick = (e) => {
    const videoId = youtubePlaceholder.getAttribute('id')
    const videoIframe = document.createElement('iframe')
    const className = youtubePlaceholder.getAttribute('class')
    videoIframe.width = youtubePlaceholder.offsetWidth
    videoIframe.height = youtubePlaceholder.offsetWidth / proportion
    videoIframe.frameBorder = 0
    videoIframe.allowfullscreen = true
    videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    videoIframe.setAttribute('class', className)
    videoIframe.setAttribute('allow', 'autoplay;')
    videoIframe.setAttribute('allowfullscreen', true)
    youtubePlaceholder.parentElement.replaceChild(videoIframe, youtubePlaceholder)
    window.addEventListener('resize', (event) => {
      videoIframe.style['height'] = videoIframe.offsetWidth / proportion + 'px'
    }, { passive: true })
  }
  node.parentNode.replaceChild(
    youtubePlaceholder, node
  )
  youtubePlaceholder.style['height'] = youtubePlaceholder.offsetWidth / proportion + 'px'
  window.addEventListener('resize', (event) => {
    youtubePlaceholder.style['height'] = youtubePlaceholder.offsetWidth / proportion + 'px'
  }, { passive: true })
}
