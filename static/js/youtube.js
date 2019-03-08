function initYoutubeVideos () {
  var youtubeVideos = document.getElementsByClassName('youtube-video')
  var proportion = 1.7777
  var iframes = []
  for (var v = 0; v < youtubeVideos.length; v++) {
    youtubeVideos[v].style['height'] = youtubeVideos[v].offsetWidth / proportion + 'px'
    youtubeVideos[v].style['background'] = 'url(https://i.ytimg.com/vi/' + youtubeVideos[v].getAttribute('id') + '/hqdefault.jpg) no-repeat'
    youtubeVideos[v].style['background-size'] = '100% 100%'
    const youtubeButton = document.createElement('img')
    youtubeButton.setAttribute('class', 'youtube-video-play')
    youtubeButton.setAttribute('src', '/../image/youtube_64dp.png')
    youtubeVideos[v].appendChild(youtubeButton)
    const youtubeWrapper = document.createElement('div')
    youtubeWrapper.style['width'] = '100%';
    youtubeVideos[v].parentNode.insertBefore(youtubeWrapper, youtubeVideos[v]);
    youtubeWrapper.appendChild(youtubeVideos[v]);
    youtubeVideos[v].onclick = function () {
      var videoId = this.id
      var videoIframe = document.createElement('iframe')
      var className = this.getAttribute('class')
      videoIframe.width = this.offsetWidth
      videoIframe.height = this.offsetWidth / proportion
      videoIframe.frameBorder = 0
      videoIframe.allowfullscreen = true
      videoIframe.src = "https://www.youtube.com/embed/" + videoId + '?autoplay=1'
      videoIframe.setAttribute('class', className)
      videoIframe.setAttribute('allow', 'autoplay;')
      videoIframe.setAttribute('allowfullscreen', true)
      iframes.push(videoIframe)
      this.parentElement.replaceChild(videoIframe, this)
    }
  }
  window.addEventListener('resize', function(event) {
    for (var v = 0; v < youtubeVideos.length; v++) {
      var youtubeVideo = document.getElementById(youtubeVideos[v].getAttribute('id'))
      if (youtubeVideo) {
        youtubeVideo.style['height'] = youtubeVideo.offsetWidth / proportion + 'px'
      }
    }
  }, { passive: true })
}
