window.copyText = (copyIcon) => {
  const textContainer = copyIcon.parentElement.initialParentElement
    ? copyIcon.parentElement.initialParentElement.shadowRoot
    : copyIcon.parentElement.parentElement
  let text
  const latexSpan = textContainer.querySelector('span[title]')
  const svg = textContainer.querySelector('svg')
  const svgImage = textContainer.querySelector('img[data-original-size]')
  const textareaInTextContainer = textContainer.querySelector('textarea')
  if (latexSpan) {
    text = latexSpan.getAttribute('title')
  } else if (svg) {
    text = svg.getAttribute('title')
      .trim()
      .split('\n')
      .map(line => line.trim())
      .join('\n')
  } else if (svgImage) {
    text = svgImage.getAttribute('title')
      .trim()
      .split('\n')
      .map(line => line.trim())
      .join('\n')
  } else if (textareaInTextContainer) {
    text = textareaInTextContainer.value
  } else {
    text = textContainer.innerText
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  copyIcon.setAttribute('src', '/image/done.svg?v=1.4.12')
  setTimeout(() => {
    copyIcon.setAttribute('src', '/image/copy.svg?v=1.4.12')
  }, 1500)
}
