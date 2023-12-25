'use strict'

/* eslint-disable no-unused-vars */
window.initYoutubeVideos = (proportion) => {
  const youtubeVideos = document.getElementsByClassName('youtube-video')
  const iframes = []
  for (let v = 0; v < youtubeVideos.length; v++) {
    youtubeVideos[v].style['height'] = youtubeVideos[v].offsetWidth / proportion + 'px'
    youtubeVideos[v].style['background'] = 'url(https://img.youtube.com/vi/' + youtubeVideos[v].getAttribute('id') + '/maxresdefault.jpg) no-repeat'
    youtubeVideos[v].style['background-size'] = '100% 100%'
    const youtubeButton = document.createElement('img')
    youtubeButton.setAttribute('class', 'youtube-video-play')
    youtubeButton.setAttribute('src', '/image/youtube_64dp.png')
    youtubeVideos[v].appendChild(youtubeButton)
    const youtubeWrapper = document.createElement('div')
    youtubeWrapper.style['width'] = '100%'
    youtubeVideos[v].parentNode.insertBefore(youtubeWrapper, youtubeVideos[v])
    youtubeWrapper.appendChild(youtubeVideos[v])
    youtubeVideos[v].onclick = (e) => {
      const youtubeVideo = e.target.id ? e.target : e.target.parentNode
      const videoId = youtubeVideo.id
      const videoIframe = document.createElement('iframe')
      const className = youtubeVideo.getAttribute('class')
      videoIframe.width = youtubeVideo.offsetWidth
      videoIframe.height = youtubeVideo.offsetWidth / proportion
      videoIframe.frameBorder = 0
      videoIframe.allowfullscreen = true
      videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`
      videoIframe.setAttribute('class', className)
      videoIframe.setAttribute('allow', 'autoplay;')
      videoIframe.setAttribute('allowfullscreen', true)
      iframes.push(videoIframe)
      youtubeVideo.parentElement.replaceChild(videoIframe, youtubeVideo)
    }
  }
  window.addEventListener('resize', (event) => {
    for (let v = 0; v < youtubeVideos.length; v++) {
      const youtubeVideo = document.getElementById(youtubeVideos[v].getAttribute('id'))
      if (youtubeVideo) {
        youtubeVideo.style['height'] = youtubeVideo.offsetWidth / proportion + 'px'
      }
    }
  }, { passive: true })
}
