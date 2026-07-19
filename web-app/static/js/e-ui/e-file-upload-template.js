import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluateActions from '#ehtml/evaluateActions.js'

class EFileUploadTemplate extends HTMLTemplateElement {
  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      this.#onEHTMLActivated,
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    initializeFileUpload(this)
  }
}

customElements.define('e-file-upload', EFileUploadTemplate, { extends: 'template' })

function buildFileUploadAccessibleName(node) {
  const parts = []
  if (node.hasAttribute('data-label-text')) {
    parts.push(node.getAttribute('data-label-text'))
  }
  if (node.hasAttribute('data-action-text')) {
    parts.push(node.getAttribute('data-action-text'))
  }
  if (node.hasAttribute('data-details-text')) {
    parts.push(node.getAttribute('data-details-text'))
  }
  if (node.hasAttribute('data-required')) {
    parts.push('Required')
  }
  return parts.join('. ') || 'Choose file'
}

function bindAccessibleFileUploadLabel(label, fileInputField, node) {
  label.setAttribute('data-focusable', '')
  label.tabIndex = 0
  label.setAttribute('aria-label', buildFileUploadAccessibleName(node))

  fileInputField.tabIndex = -1

  if (node.hasAttribute('data-required')) {
    fileInputField.setAttribute('aria-required', 'true')
  }

  label.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      fileInputField.click()
    }
  })
}

function initializeFileUpload(node) {
  const label = document.createElement('label')
  if (node.hasAttribute('data-label-text')) {
    const textNode = document.createElement('b')
    textNode.textContent = node.getAttribute('data-label-text')
    label.appendChild(textNode)
  }
  if (node.hasAttribute('data-set-height')) {
    label.setAttribute('data-set-height', '')
  }
  const fileInputField = document.createElement('input')
  fileInputField.setAttribute('type', 'file')
  fileInputField.setAttribute('name', node.getAttribute('data-name'))
  if (node.hasAttribute('data-required')) {
    fileInputField.setAttribute('required', '')
  }
  if (node.hasAttribute('data-validation-absence-error-message')) {
    fileInputField.setAttribute(
      'data-validation-absence-error-message',
      node.getAttribute('data-validation-absence-error-message')
    )
  }
  if (node.hasAttribute('data-ignore')) {
    fileInputField.setAttribute('data-ignore', 'true')
  }
  const accept = node.getAttribute('data-accept')
  fileInputField.setAttribute('accept', accept)
  const fileInputIcon = document.createElement('img')
  fileInputIcon.src = node.getAttribute('data-icon-src')
  fileInputIcon.alt = ''
  fileInputIcon.setAttribute('aria-hidden', 'true')

  if (node.hasAttribute('data-action-text')) {
    const actionSpan = document.createElement('span')
    actionSpan.innerText = node.getAttribute('data-action-text')
    label.appendChild(actionSpan)
  }

  if (node.hasAttribute('data-details-text')) {
    const detailsSpan = document.createElement('span')
    detailsSpan.innerText = node.getAttribute('data-details-text')
    label.appendChild(detailsSpan)
  }
  
  label.appendChild(fileInputField)
  label.appendChild(fileInputIcon)

  bindAccessibleFileUploadLabel(label, fileInputField, node)

  if (node.internalState && node.internalState['preuploadedFiles']) {
    const fileNameSpan = document.createElement('b')
    if (preuploadedFiles.length > 0) {
      fileNameSpan.innerHTML = preuploadedFiles.map(file => `<a href="${file.url}${queryForPreuploadedFiles}">${file.filename}</a>`).join('<br>')
      label.appendChild(fileNameSpan)
    }
  }

  if (node.hasAttribute('multiple')) {
    fileInputField.setAttribute('multiple', 'true')
  }

  node.parentNode.replaceChild(
    label, node
  )

  const maxSizeInMb = node.getAttribute('data-max-size-in-mb') * 1

  function runFileLoadStart(fileName) {
    if (node.hasAttribute('data-actions-on-file-load-start')) {
      evaluateActions(
        node.getAttribute('data-actions-on-file-load-start'),
        node,
        {
          fileName,
          ...getNodeScopedState(node)
        }
      )
    }
  }

  function runFileLoadEnd(fileName) {
    if (node.hasAttribute('data-actions-on-file-load-end')) {
      evaluateActions(
        node.getAttribute('data-actions-on-file-load-end'),
        node,
        {
          fileName,
          ...getNodeScopedState(node)
        }
      )
    }
  }

  function runFileLoadProgress(percentage, fileName) {
    if (node.hasAttribute('data-actions-on-file-load-progress')) {
      const action = node.getAttribute('data-actions-on-file-load-progress')
      evaluateActions(
        action,
        node,
        {
          percentage,
          fileName,
          ...getNodeScopedState(node)
        }
      )
    }
  }

  async function loadFilesFromList(files) {
    for (const [index, file] of files.entries()) {
      runFileLoadStart(file.name)
      await loadFile(file, maxSizeInMb, index > 0)
      runFileLoadEnd(file.name)
    }
  }

  fileInputField.addEventListener('change', async (e) => {
    if (node.hasAttribute('multiple')) {
      const files = [...e.target.files]
      if (node.hasAttribute('data-max-number-of-files')) {
        if (files.length > (node.getAttribute('data-max-number-of-files') * 1)) {
          if (node.hasAttribute('data-show-errors-in-toast')) {
            showErrorToast(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
            fileInputField.value = ""
          } else if (node.hasAttribute('data-show-errors-in-toast-in-dialog')) {
            showErrorToastInDialog(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
            fileInputField.value = ""
          } else {
            alert(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
          }
          return
        }
      }
      await loadFilesFromList(files)
    } else {
      const file = e.target.files[0]
      runFileLoadStart(file.name)
      await loadFile(file, maxSizeInMb)
      runFileLoadEnd(file.name)
    }
  })

  if (fileInputField.form) {
    fileInputField.form.addEventListener('reset', () => {
        if (node.internalState && node.internalState['preuploadedFiles']) {
          const fileNameSpan = document.createElement('b')
          if (preuploadedFiles.length > 0) {
            fileNameSpan.innerHTML = preuploadedFiles.map(file => `<a href="${file.url}${queryForPreuploadedFiles}">${file.filename}</a>`).join('<br>')
            label.appendChild(fileNameSpan)
          }
        } else {
          const fileNameSpanFromPrevSelection = label.querySelector('b[data-name="file-names"]')
          if (fileNameSpanFromPrevSelection) {
            label.removeChild(fileNameSpanFromPrevSelection)
          }
          if (accept.includes('image') && fileInputIcon && node.getAttribute('data-icon-src')) {
            fileInputIcon.src = node.getAttribute('data-icon-src')
          }
        }
    })
  }

  label.addEventListener('dragover', (e) => {
    e.preventDefault()
    label.classList.add('dragover')
  })

  label.addEventListener('dragleave', () => {
    label.classList.remove('dragover')
  })

  label.addEventListener('drop', async (e) => {
    e.preventDefault()
    label.classList.remove('dragover')

    if (node.hasAttribute('multiple')) {
      const files = [...e.dataTransfer.files]
      if (node.hasAttribute('data-max-number-of-files')) {
        if (files.length > (node.getAttribute('data-max-number-of-files') * 1)) {
          if (node.hasAttribute('data-show-errors-in-toast')) {
            showErrorToast(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
            fileInputField.value = ""
          } else if (node.hasAttribute('data-show-errors-in-toast-in-dialog')) {
            showErrorToastInDialog(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
            fileInputField.value = ""
          } else {
            alert(`Max number of files is ${node.getAttribute('data-max-number-of-files')}`)
          }
          return
        }
      }
      await loadFilesFromList(files)
    } else {
      const file = e.dataTransfer.files[0]
      runFileLoadStart(file.name)
      await loadFile(file, maxSizeInMb)
      runFileLoadEnd(file.name)
    }
  })

  async function loadFile(file, maxSizeInMb, appendFile) {
    if (!file) {
      return
    }

    const maxSize = maxSizeInMb * 1024 * 1024
    if (!accept.split(', ').includes(file.type)) {
      if (node.hasAttribute('data-show-errors-in-toast')) {
        showErrorToast(`Only ${accept} are allowed.`)
        fileInputField.value = ""
      } else if (node.hasAttribute('data-show-errors-in-toast-in-dialog')) {
        showErrorToastInDialog(`Only ${accept} are allowed.`)
        fileInputField.value = ""
      } else {    
        alert(`Only ${accept} are allowed.`)
      }
      return
    }

    if (file.size > maxSize) {
      if (node.hasAttribute('data-show-errors-in-toast')) {
        showErrorToast(`File too large. Max ${maxSizeInMb}MB.`)
        fileInputField.value = ""
      } else if (node.hasAttribute('data-show-errors-in-toast-in-dialog')) {
        showErrorToastInDialog(`File too large. Max ${maxSizeInMb}MB.`)
        fileInputField.value = ""
      } else { 
        alert(`File too large. Max ${maxSizeInMb}MB.`)
      }
      return
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.min(
            100,
            Math.max(0, Math.round((event.loaded / event.total) * 100))
          )
          runFileLoadProgress(percentage, file.name)
        }
      }
      reader.onload = (e) => {
        try {
          const fileNameSpanFromPrevSelection = label.querySelector('b[data-name="file-names"]')
          let previousFileNames
          if (fileNameSpanFromPrevSelection) {
            previousFileNames = fileNameSpanFromPrevSelection.innerText
            label.removeChild(fileNameSpanFromPrevSelection)
          }
          if (!node.hasAttribute('data-hide-upload-file-name')) {
            const fileNameSpan = document.createElement('b')
            fileNameSpan.setAttribute('data-name' , 'file-names')
            label.appendChild(fileNameSpan)
            if (appendFile && previousFileNames) {
              fileNameSpan.innerText += previousFileNames + ', ' + file.name
            } else if (fileNameSpan) {
              fileNameSpan.innerText = file.name
            }
          }
          if (accept.includes('image')) {
            fileInputIcon.src = e.target.result
          }
          resolve(e.target.result)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => {
        reject(reader.error)
      }
      reader.readAsDataURL(file)
    })
  }
}
