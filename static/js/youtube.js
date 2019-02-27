function initYoutubeVideos() {
  var youtubeVideos = document.getElementsByClassName('youtube-video')
  var proportion = 1.78
  var iframes = []
  for (var v = 0; v < youtubeVideos.length; v++) {
    youtubeVideos[v].style['height'] = youtubeVideos[v].offsetWidth / proportion + 'px'
    youtubeVideos[v].style['background'] = 'url(http://i.ytimg.com/vi/' + youtubeVideos[v].getAttribute('id') + '/maxresdefault.jpg) no-repeat'
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
      videoIframe.width = this.offsetWidth
      videoIframe.height = this.offsetWidth / proportion
      videoIframe.frameBorder = 0
      videoIframe.allowfullscreen = true
      videoIframe.src = "https://www.youtube.com/embed/" + videoId + '?autoplay=1'
      videoIframe.style['margin-top'] = '25px'
      iframes.push(videoIframe)
      this.parentElement.replaceChild(videoIframe, this)
    }
  }
  window.addEventListener('resize', function(event) {
    for (var v = 0; v < youtubeVideos.length; v++) {
      youtubeVideos[v].style['height'] = youtubeVideos[v].offsetWidth / proportion + 'px'
    }
    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i]) {
        iframes[i].width = iframes[i].parentElement.offsetWidth
        iframes[i].height = iframes[i].parentElement.offsetWidth / proportion
      }
    }
  }, { passive: true })
}
