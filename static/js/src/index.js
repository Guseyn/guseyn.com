'use strict'

let localStyle = localStorage.getItem('localStyle') || 'day'
if (localStyle === 'night') {
  let mainNightStyle = document.getElementById('main-night')
  let githubGistStyle = document.getElementById('github-gist-night')
  mainNightStyle.disabled = false
  githubGistStyle.disabled = false
}
