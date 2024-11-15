window.setStyle = () => {
  const localStyle = localStorage.getItem('localStyle') || 'day'
  const mainNightStyle = document.getElementById('main-night')
  const githubGistStyle = document.getElementById('github-gist-night')
  if (localStyle === 'night') {
    mainNightStyle.disabled = false
    if (githubGistStyle) {
      githubGistStyle.disabled = false
    }
  } else {
    mainNightStyle.disabled = true
    if (githubGistStyle) {
      githubGistStyle.disabled = true
    }
  }
}

window.changeStyle = () => {
  let localStyle = localStorage.getItem('localStyle') || 'day'
  if (localStyle === 'night') {
    localStorage.setItem('localStyle', 'day')
  } else {
    localStorage.setItem('localStyle', 'night')
  }
  window.setStyle()
}

window.setStyle()
