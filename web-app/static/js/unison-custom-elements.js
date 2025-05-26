'use strict'

const PERCEPTION_TIME = 0.005
const PRECISION = 0.0001

window.__ehtmlCustomElements__['unison-font-loader-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  const loadingFontsForRenderingSVGsFinishedEventListener = () => {
    node.parentNode.replaceChild(
      document.importNode(node.content, true), node
    )
    document.body.classList.toggle('progress-opacity')
    scrollToHash()
    window.removeEventListener('loadingFontsForRenderingSVGsFinished', loadingFontsForRenderingSVGsFinishedEventListener)
  }
  window.addEventListener('loadingFontsForRenderingSVGsFinished', loadingFontsForRenderingSVGsFinishedEventListener)
  if (node.hasAttribute('data-font-urls')) {
    const fontUrls = node.getAttribute('data-font-urls').split(',')
    document.body.classList.toggle('progress-opacity')
    window.loadFontsForRenderingSVGsViaWorker(fontUrls)
  } else {
    document.body.classList.toggle('progress-opacity')
    window.loadFontsForRenderingSVGsViaWorker()
  }
}

window.__ehtmlCustomElements__['unison-svg-midi-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-svg-midi"> must have id attribute')
  }
  const id = node.getAttribute('id')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
  const unilangOutputRetrievedEvent = (event) => {
    const svgString = event.detail.unilangOutputsForEachPage[0].svg
    const domParser = new DOMParser()
    const svg = domParser.parseFromString(svgString, 'image/svg+xml').documentElement
    svg.setAttribute('title', unilangText)
    node.parentNode.replaceChild(
      svg, node
    )

    const midiForAllPages = event.detail.midiForAllPages
    const soundFont = node.getAttribute('data-sound-font')
    const midiPlayer = window.createMidiPlayer(id, midiForAllPages, soundFont)
    svg.parentNode.appendChild(midiPlayer)

    const customStyles = event.detail.unilangOutputsForEachPage[0].customStyles
    svg.parentNode.style.backgroundColor = customStyles.backgroundColor || '#FDF5E6'

    window.attachHighliterToMidiPlayer(midiPlayer, svg.parentNode, customStyles)

    window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  }
  window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: false } ], false, true, true, id)
}

window.__ehtmlCustomElements__['unison-svg-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-svg"> must have id attribute')
  }
  const id = node.getAttribute('id')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
  const unilangOutputRetrievedEvent = (event) => {
    const svgString = event.detail.unilangOutputsForEachPage[0].svg
    const domParser = new DOMParser()
    const svg = domParser.parseFromString(svgString, 'image/svg+xml').documentElement
    svg.setAttribute('title', unilangText)
    node.parentNode.replaceChild(
      svg, node
    )

    // const customStyles = event.detail.unilangOutputsForEachPage[0].customStyles
    // svgString.parentNode.style.backgroundColor = customStyles.backgroundColor || '#FDF5E6'
    // svgString.setAttribute('title', unilangText)

    window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  }
  window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: false } ], false, true, false, id)
}

window.__ehtmlCustomElements__['unison-midi-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-midi"> must have id attribute')
  }
  const isHidden = node.hasAttribute('data-hidden')
  const isAutoPlay = node.hasAttribute('data-autoplay')
  const id = node.getAttribute('id')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
  const unilangOutputRetrievedEvent = (event) => {
    const midiForAllPages = event.detail.midiForAllPages
    const soundFont = node.getAttribute('data-sound-font')
    const midiPlayer = window.createMidiPlayer(id, midiForAllPages, soundFont)
    midiPlayer.setAttribute('id', id)
    node.parentNode.replaceChild(
      midiPlayer, node
    )
    window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
    if (isHidden) {
      midiPlayer.style.display = 'none'
      midiPlayer.setAttribute('data-hidden', 'true')
    }
    if (isAutoPlay) {
      const playButton = midiPlayer.shadowRoot.querySelector('button')
      if (!playButton.parentElement.classList.contains('playing')) {
        playButton.click()
      }
    }
  }
  window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: false } ], false, false, true, id)
}

window.__ehtmlCustomElements__['unison-text-highlights-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-text-highlights"> must have id attribute')
  }
  const id = node.getAttribute('id')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
  const unilangOutputRetrievedEvent = (event) => {
    const htmlHighlightsAsString = event.detail.unilangOutputsForEachPage[0].highlightsHtmlBuffer.join('')
    const preWithHighlights = document.createElement('pre')
    preWithHighlights.innerHTML = htmlHighlightsAsString
    preWithHighlights.style.fontFamily = 'FiraCode'
    preWithHighlights.style.fontSize = '1em'
    preWithHighlights.style.whiteSpace = 'pre'
    preWithHighlights.style.lineHeight = '1.25em'
    node.parentNode.replaceChild(
      preWithHighlights, node
    )
    window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  }
  window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: false } ], true, false, false, id)
}

window.__ehtmlCustomElements__['unison-textarea-svg-midi-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-textarea-svg-midi"> must have id attribute')
  }
  const spanWithActions = node.parentElement.querySelector('span')
  if (!spanWithActions) {
    throw new Error('<template is="unison-textarea-svg-midi"> must include span with action icons')
  }
  const id = node.getAttribute('id')
  const copyIcon = spanWithActions.querySelector('.copy-icon')
  const editIcon = spanWithActions.querySelector('.edit-icon')
  const renderIcon = spanWithActions.querySelector('.render-icon')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
  const textarea = document.createElement('textarea')
  textarea.value = unilangText
  node.parentNode.replaceChild(
    textarea, node
  )
  window.initializeUnisonTextarea(
    textarea, renderIcon, editIcon
  )

  textarea.setAttribute('placeholder', 'Type here...')

  const divUnderneathTextarea = textarea.initialParentElement.shadowRoot.querySelector('.div-underneath-unitextarea')
  const lineNumbersColumn = textarea.initialParentElement.shadowRoot.querySelector('.line-numbers-column')
  const autocompleteListView = textarea.initialParentElement.shadowRoot.querySelector('.autocomplete-list-view')

  textarea.initialParentElement.style.height = '270px'
  textarea.initialParentElement.style.backgroundColor = 'transparent'
  textarea.initialParentElement.style.overflow = 'visible'
  textarea.initialParentElement.shadowRoot.appendChild(spanWithActions)
  spanWithActions.initialParentElement = textarea.initialParentElement

  const computedStylesForTextareaParent = window.getComputedStyle(textarea.initialParentElement)
  const textareaParentInitialPadding = computedStylesForTextareaParent.getPropertyValue('padding')
  const textareaParentInitialHeight = computedStylesForTextareaParent.getPropertyValue('height')
  textarea.initialParentElement.initialPadding = textareaParentInitialPadding
  textarea.initialParentElement.initialHeight = textareaParentInitialHeight

  const additionalStyleContent = `
    span:has(img.copy-icon) {
      display: inline-block;
      position: sticky;
      width: 1px;
      height: 24px;
      z-index: 10;
      left: 100%;
      right: 0px;
      top: 0;
    }
    .copy-icon,
    .edit-icon,
    .render-icon {
      position: absolute;
      top: -0.6rem;
      right: -0.6rem;
      width: 24px;
      height: 24px;
      opacity: 0.6;
      user-select: none;
    }
    .edit-icon,
    .render-icon {
      right: 1.2rem;
    }
    .copy-icon:hover,
    .edit-icon:hover,
    .render-icon:hover {
      opacity: 1.0;
      cursor: pointer;
    }
    div:has(pre) span:has(img) {
      cursor: text;
    }

    midi-player {
      display: block;
      width: 100%;
      box-sizing: content-box;
      position: sticky;
      left: 0;
      right: 0;
    }

    svg + midi-player {
      border-top: 1px solid var(--tolbar-border-color);
    }

    svg {
      display: block;
      margin-top: -1.4em;
      margin-left: auto;
      margin-right: auto;
    }

    label {
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
    }

    label.block:has(img) {
      display: block;
      width: max-content;
    }

    label[data-correct="true"] {
      color: #009F6B;
    }

    label[data-correct="false"] {
      color: #C40233;
    }

    label:has(img) {
      padding: 0.6rem;
      margin: 0 auto;
    }

    label img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
  `
  const styleElement = textarea.initialParentElement.shadowRoot.querySelector('style')
  styleElement.textContent += additionalStyleContent

  renderIcon.addEventListener('click', () => {
    if (textarea.isRenderedWithLatestUnilangInputText) {
      hideTextareaAndShowPreview(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)
      const midiPlayer = textarea.initialParentElement.shadowRoot.querySelector('midi-player')
      midiPlayer.style.display = 'block'
      return
    }
    const unilangText = textarea.value
    const unilangOutputRetrievedEvent = (event) => {
      const svgBefore = textarea.initialParentElement.shadowRoot.querySelector('svg')
      const midiPlayerBefore = textarea.initialParentElement.shadowRoot.querySelector('midi-player')

      if (svgBefore) {
        textarea.initialParentElement.shadowRoot.removeChild(svgBefore)
      }
      if (midiPlayerBefore) {
        textarea.initialParentElement.shadowRoot.removeChild(midiPlayerBefore)
      }

      const svgString = event.detail.unilangOutputsForEachPage[0].svg
      const domParser = new DOMParser()
      const svg = domParser.parseFromString(svgString, 'image/svg+xml').documentElement
      svg.setAttribute('title', unilangText)

      textarea.initialParentElement.shadowRoot.appendChild(svg)

      const midiForAllPages = event.detail.midiForAllPages
      const midiDataSrc = midiForAllPages.dataSrc
      const soundFont = node.getAttribute('data-sound-font')
      const midiPlayer = window.createMidiPlayer(id, midiForAllPages, soundFont)
      textarea.initialParentElement.shadowRoot.appendChild(midiPlayer)

      const customStyles = event.detail.unilangOutputsForEachPage[0].customStyles
      textarea.initialParentElement.style.backgroundColor = customStyles.backgroundColor || '#FDF5E6'

      window.attachHighliterToMidiPlayer(midiPlayer, svg.parentNode, customStyles)

      hideTextareaAndShowPreview(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)
      midiPlayer.style.display = 'block'

      textarea.initialParentElement.style.opacity = '1.0'

      refreshDivUnderneathTextareaWithNewHtml(
        divUnderneathTextarea,
        event.detail.unilangOutputsForEachPage[0].highlightsHtmlBuffer.join('')
      )

      textarea.isRenderedWithLatestUnilangInputText = true
      textarea.isModified = false

      window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
    }
    window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
    window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: textarea.isRenderedWithLatestUnilangInputText } ], true, true, true, id)
    textarea.initialParentElement.style.opacity = '0.5'
  })

  editIcon.addEventListener('click', () => {
    hidePreviewAndShowTextarea(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)
    const midiPlayer = textarea.initialParentElement.shadowRoot.querySelector('midi-player')
    midiPlayer.style.display = 'none'
  })
}

window.__ehtmlCustomElements__['unison-textarea-svg-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-textarea-svg"> must have id attribute')
  }
  const spanWithActions = node.parentElement.querySelector('span')
  if (!spanWithActions) {
    throw new Error('<template is="unison-textarea-svg"> must include span with action icons')
  }
  const id = node.getAttribute('id')
  const copyIcon = spanWithActions.querySelector('.copy-icon')
  const editIcon = spanWithActions.querySelector('.edit-icon')
  const renderIcon = spanWithActions.querySelector('.render-icon')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
    .trim()
    .split('\n')
    .map(line => line.trim())
    .join('\n')
  const textarea = document.createElement('textarea')
  textarea.value = unilangText
  node.parentNode.replaceChild(
    textarea, node
  )
  window.initializeUnisonTextarea(
    textarea, renderIcon, editIcon
  )

  textarea.setAttribute('placeholder', 'Type here...')

  const divUnderneathTextarea = textarea.initialParentElement.shadowRoot.querySelector('.div-underneath-unitextarea')
  const lineNumbersColumn = textarea.initialParentElement.shadowRoot.querySelector('.line-numbers-column')
  const autocompleteListView = textarea.initialParentElement.shadowRoot.querySelector('.autocomplete-list-view')

  textarea.initialParentElement.style.height = '270px'
  textarea.initialParentElement.style.backgroundColor = 'transparent'
  textarea.initialParentElement.style.overflow = 'visible'
  textarea.initialParentElement.shadowRoot.appendChild(spanWithActions)
  spanWithActions.initialParentElement = textarea.initialParentElement

  const computedStylesForTextareaParent = window.getComputedStyle(textarea.initialParentElement)
  const textareaParentInitialPadding = computedStylesForTextareaParent.getPropertyValue('padding')
  const textareaParentInitialHeight = computedStylesForTextareaParent.getPropertyValue('height')
  textarea.initialParentElement.initialPadding = textareaParentInitialPadding
  textarea.initialParentElement.initialHeight = textareaParentInitialHeight

  const additionalStyleContent = `
    span:has(img.copy-icon) {
      display: inline-block;
      position: sticky;
      width: 1px;
      height: 24px;
      z-index: 10;
      left: 100%;
      right: 0px;
      top: 0;
    }
    .copy-icon,
    .edit-icon,
    .render-icon {
      position: absolute;
      top: -0.6rem;
      right: -0.6rem;
      width: 24px;
      height: 24px;
      opacity: 0.6;
      user-select: none;
    }
    .edit-icon,
    .render-icon {
      right: 1.2rem;
    }
    .copy-icon:hover,
    .edit-icon:hover,
    .render-icon:hover {
      opacity: 1.0;
      cursor: pointer;
    }
    div:has(pre) span:has(img) {
      cursor: text;
    }

    svg {
      display: block;
      margin-top: -1.4em;
      margin-left: auto;
      margin-right: auto;
    }

    label {
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
    }

    label.block:has(img) {
      display: block;
      width: max-content;
    }

    label[data-correct="true"] {
      color: #009F6B;
    }

    label[data-correct="false"] {
      color: #C40233;
    }

    label:has(img) {
      padding: 0.6rem;
      margin: 0 auto;
    }

    label img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
  `
  const styleElement = textarea.initialParentElement.shadowRoot.querySelector('style')
  styleElement.textContent += additionalStyleContent

  renderIcon.addEventListener('click', () => {
    if (textarea.isRenderedWithLatestUnilangInputText) {
      hideTextareaAndShowPreview(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)
      return
    }
    const unilangText = textarea.value
    const unilangOutputRetrievedEvent = (event) => {
      const svgBefore = textarea.initialParentElement.shadowRoot.querySelector('svg')
      const midiPlayerBefore = textarea.initialParentElement.shadowRoot.querySelector('midi-player')

      if (svgBefore) {
        textarea.initialParentElement.shadowRoot.removeChild(svgBefore)
      }
      if (midiPlayerBefore) {
        textarea.initialParentElement.shadowRoot.removeChild(midiPlayerBefore)
      }

      const svgString = event.detail.unilangOutputsForEachPage[0].svg
      const domParser = new DOMParser()
      const svg = domParser.parseFromString(svgString, 'image/svg+xml').documentElement
      svg.setAttribute('title', unilangText)

      textarea.initialParentElement.shadowRoot.appendChild(svg)

      const customStyles = event.detail.unilangOutputsForEachPage[0].customStyles
      textarea.initialParentElement.style.backgroundColor = customStyles.backgroundColor || '#FDF5E6'

      hideTextareaAndShowPreview(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)

      textarea.initialParentElement.style.opacity = '1.0'

      refreshDivUnderneathTextareaWithNewHtml(
        divUnderneathTextarea,
        event.detail.unilangOutputsForEachPage[0].highlightsHtmlBuffer.join('')
      )

      textarea.isRenderedWithLatestUnilangInputText = true
      textarea.isModified = false

      window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
    }
    window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
    window.unilangOutputViaWorker([ { unilangInputText: unilangText, isRenderedWithLatestUnilangInputText: textarea.isRenderedWithLatestUnilangInputText } ], true, true, false, id)
    textarea.initialParentElement.style.opacity = '0.5'
  })

  editIcon.addEventListener('click', () => {
    hidePreviewAndShowTextarea(textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon)
  })
}

///////////////////////////// FUNCTIONS /////////////////////////////

window.attachHighliterToMidiPlayer = (midiPlayer, svgParent, customStyles) => {
  const highlighColor = '#C40233'
  const midiProgressBar = midiPlayer.shadowRoot.querySelector('.seek-bar')
  const currentTimeLabel = midiPlayer.shadowRoot.querySelector('.current-time')
  const totalTimeLabel = midiPlayer.shadowRoot.querySelector('.total-time')
  const playButton = midiPlayer.shadowRoot.querySelector('button')

  const progressChangeEvent = (event) => {
    const originalFontColor = customStyles.fontColor || '#121212'
    if (event.type === 'input' || event.type === 'change' || event.type === 'stop') {
      const refElms = svgParent.querySelectorAll(`[fill="${highlighColor}"]`)
      refElms.forEach((refElm) => {
        refElm.setAttribute('fill', originalFontColor)
      })
      midiPlayer.progressInterruptedFlowOfNoteEvents = true
      return
    }

    let thisIsFirstNoteEventAfterFlowInterrupted = false
    if (event.type === 'note' && midiPlayer.progressInterruptedFlowOfNoteEvents) {
      midiPlayer.progressInterruptedFlowOfNoteEvents = false
      thisIsFirstNoteEventAfterFlowInterrupted = true
    }

    const closestTimeStampMappedWithRefsOnForCurrentNote = []
    for (let error = -PERCEPTION_TIME; error <= PERCEPTION_TIME; error += PRECISION) {
      const closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError = midiPlayer.timeStampsMappedWithRefsOn[(event.detail.note.startTime + error).toFixed(4) * 1]
      if (closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError !== undefined) {
        closestTimeStampMappedWithRefsOnForCurrentNote.push(
          ...closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError
        )
      }
    }

    closestTimeStampMappedWithRefsOnForCurrentNote.forEach((refToHighlight, refToHighlightIndex) => {
      const refElms = svgParent.querySelectorAll(`[ref-ids*="${refToHighlight.refId}"]`)
      refElms.forEach((refElm) => {
        refElm.querySelectorAll('path').forEach((pathElm) => {
          pathElm.setAttribute('fill', highlighColor)
        })
      })
      const unhighlightNoteTimeout = setTimeout(() => {
        refElms.forEach((refElm) => {
          refElm.querySelectorAll('path').forEach((pathElm) => {
            pathElm.setAttribute('fill', originalFontColor)
          })
        })
        clearTimeout(unhighlightNoteTimeout)
        const midiProgressBarMaxValue = midiProgressBar.getAttribute('max') * 1
        if ((event.detail.note.startTime + refToHighlight.duration) >= midiProgressBarMaxValue) {
          midiProgressBar.value = midiProgressBarMaxValue
          if (playButton.parentElement.classList.contains('playing')) {
            currentTimeLabel.innerText = totalTimeLabel.innerText
            playButton.click()
          }
        }
      }, refToHighlight.duration * 1000)
    })

  }

  midiPlayer.addEventListener('note', progressChangeEvent)
  midiPlayer.addEventListener('stop', progressChangeEvent)
  midiProgressBar.addEventListener('change', progressChangeEvent)
  midiProgressBar.addEventListener('input', progressChangeEvent)

  midiProgressBar.addEventListener('change', () => {
    if (playButton.parentElement.classList.contains('playing')) {
      playButton.click()
      playButton.click()
    }
  })

  svgParent.addEventListener('click', (event) => {
    if (event.target.tagName !== 'path') {
      return
    }
    if (!event.target.parentNode) {
      return
    }
    let refIds
    const refDataName = event.target.parentNode.getAttribute('data-name')
    if (refDataName === 'noteBody') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'rest') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'simileStrokes') {
      refIds = event.target.parentNode.parentNode.parentNode.getAttribute('ref-ids')
    }
    if (!refIds) {
      return
    }
    const splittedRefIds = refIds.split(',')
    const theOnlyPageIndex = 0
    if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex] === undefined) {
      return
    }
    for (const refIdIndex in splittedRefIds) {
      const refId = splittedRefIds[refIdIndex]
      if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId] !== undefined) {
        midiProgressBar.value = midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId] - PRECISION
        midiProgressBar.dispatchEvent(new CustomEvent('change'))
        break
      }
    }
  })
}

window.createMidiPlayer = (id, midiForAllPages, soundFont) => {
  soundFont = soundFont || 'https://cdn.unisonofficial.com/magenta-soundfonts/SGM'
  const midiPlayer = document.createElement('midi-player')
  midiPlayer.setAttribute('id', `midi-player-${id}`)
  midiPlayer.setAttribute('sound-font', soundFont)
  midiPlayer.setAttribute('visualizer', '#myVisualizer')
  midiPlayer.setAttribute(
    'src',
    midiForAllPages.dataSrc
  )
  midiPlayer.timeStampsMappedWithRefsOn = midiForAllPages.timeStampsMappedWithRefsOn
  midiPlayer.refsOnMappedWithTimeStamps = midiForAllPages.refsOnMappedWithTimeStamps
  return midiPlayer
}

function hideTextareaAndShowPreview (textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon) {
  textarea.style.display = 'none'
  divUnderneathTextarea.style.display = 'none'
  lineNumbersColumn.style.display = 'none'
  autocompleteListView.style.display = 'none'
  textarea.initialParentElement.style.padding = '0px'
  textarea.initialParentElement.style.height = ''
  textarea.initialParentElement.style.overflow = 'auto'
  copyIcon.style.top = '0.6rem'
  copyIcon.style.right = '0.6rem'
  editIcon.style.top = '0.6rem'
  editIcon.style.right = '2.4rem'
  renderIcon.style.top = '0.6rem'
  renderIcon.style.right = '2.4rem'
  renderIcon.style.display = 'none'
  editIcon.style.display = 'inline-block'

  const svg = textarea.initialParentElement.shadowRoot.querySelector('svg')
  svg.style.display = 'block'
}

function hidePreviewAndShowTextarea (textarea, divUnderneathTextarea, lineNumbersColumn, autocompleteListView, copyIcon, editIcon, renderIcon) {
  textarea.style.display = 'block'
  divUnderneathTextarea.style.display = 'block'
  lineNumbersColumn.style.display = 'block'
  autocompleteListView.style.display = 'block'
  textarea.initialParentElement.style.padding = textarea.initialParentElement.initialPadding
  textarea.initialParentElement.style.height = textarea.initialParentElement.initialHeight
  textarea.initialParentElement.style.overflow = 'visible'
  textarea.initialParentElement.style.backgroundColor = '#ffffff'
  copyIcon.style.top = '-0.6rem'
  copyIcon.style.right = '-0.6rem'
  editIcon.style.top = '-0.6rem'
  editIcon.style.right = '1.2rem'
  renderIcon.style.top = '-0.6rem'
  renderIcon.style.right = '1.2rem'
  renderIcon.style.display = 'inline-block'
  editIcon.style.display = 'none'

  const svg = textarea.initialParentElement.shadowRoot.querySelector('svg')

  svg.style.display = 'none'
}

function refreshDivUnderneathTextareaWithNewHtml (divUnderneathTextarea, html) {
  const oldTextContainer = divUnderneathTextarea.textContainer
  const newTextContainer = divUnderneathTextarea.textContainer.cloneNode(false)
  newTextContainer.innerHTML = html
  oldTextContainer.parentNode.replaceChild(newTextContainer, oldTextContainer)
  divUnderneathTextarea.textContainer = newTextContainer
}
