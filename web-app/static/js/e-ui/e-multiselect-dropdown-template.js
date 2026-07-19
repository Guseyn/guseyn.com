class MultiselectDropdown extends HTMLTemplateElement {
  constructor() {
    super()
    this.ehtmlActivated = false
    const Ekbd = customElements.get('e-kbd')
    this.ekbd = Ekbd
    if (!Ekbd) {
      throw new Error(`

<template is="e-multiselect-dropdown"> requires <kbd is="e-kbd">.
Please import it as shown below:
  import '#e-ui/e-kbd.js'
      `)
    }
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
    initializeMultiselect(this)
  }
}

customElements.define('e-multiselect-dropdown', MultiselectDropdown, { extends: 'template' })

function initializeMultiselect (node) {
  const multiSelect = document.createElement('div')
  multiSelect.setAttribute('is', 'e-stack')
  multiSelect.setAttribute('data-generated-by-e-dropdown-multiselect-template', '')
  const multiSelectId = node.getAttribute('id')
  if (multiSelectId) {
    multiSelect.setAttribute('id', multiSelectId)
  }
  const multiSelectIsAlwaysOn = node.hasAttribute('data-always-on')
  let listOfSelectedElements
  if (!multiSelectIsAlwaysOn) {
    listOfSelectedElements = document.createElement('div')
    listOfSelectedElements.setAttribute('is', 'e-row')
    listOfSelectedElements.setAttribute('data-keep-flex-direction-row-in-mobile', '')
  }
  const searchLabel = document.createElement('label')
  const searchLabelText = document.createElement('span')
  searchLabelText.innerHTML = node.getAttribute('data-label')
  searchLabel.appendChild(searchLabelText)
  if (!multiSelectIsAlwaysOn) {
    searchLabel.appendChild(listOfSelectedElements)
  }
  const searchInput = document.createElement('input')
  searchInput.setAttribute('type', 'text')
  searchInput.setAttribute('placeholder', 'Search...')
  searchInput.setAttribute('name', 'search')
  searchInput.setAttribute('autocomplete', 'off')
  searchInput.setAttribute('data-ignore', 'true')

  searchLabel.appendChild(searchInput)

  multiSelect.appendChild(searchLabel)

  const arrayOfValues = node.internalState['values'] || []
  const valueDisplayFunction = node.internalState['valueDisplayFunction'] || function (internalState, value) {
    return value
  }
  const arrayOfSelectedValues = node.internalState['selectedValues'] || []

  const dropdown = document.createElement('e-scrollable')
  dropdown.style.display = 'none'
  const name = node.getAttribute('data-name')
  if (!multiSelectIsAlwaysOn) {
    const closeLinkBox = document.createElement('div')
    closeLinkBox.setAttribute('is', 'e-stack')
    closeLinkBox.setAttribute('data-elm', 'close-link')
    const closeLink = document.createElement('span')
    closeLink.addEventListener('click', (e) => {
      e.preventDefault()
      dropdown.style.display = 'none'
      searchInput.blur()
      return false
    })
    closeLink.appendChild(document.createTextNode('✕ Close'))
    closeLinkBox.appendChild(closeLink)
    const kbd = new (node.ekbd)()
    kbd.setAttribute('is', 'e-kbd')
    kbd.setAttribute('data-trigger-in-inputs', 'true')
    kbd.setAttribute('data-action', /*js*/`
      document.querySelector('[data-elm="close-link"] > span').click()
    `)
    kbd.innerHTML = 'escape'
    closeLinkBox.appendChild(kbd)
    dropdown.appendChild(closeLinkBox)
  } else {
    dropdown.style.display = ''
    dropdown.setAttribute('data-always-on', '')
  }
  const allLabels = []
  const labelColumn = document.createElement('div')
  labelColumn.setAttribute('is', 'e-stack')
  if (arrayOfValues.length > 0) {
    dropdown.appendChild(labelColumn)
  }
  arrayOfValues.forEach((value, index) => {
    const label = document.createElement('label')
    label.setAttribute('data-font-size', 'xs')
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.addEventListener('change', () => {
      if (!multiSelectIsAlwaysOn) {
        updateListOfSelectedElements(allLabels, listOfSelectedElements)
      }
    })
    input.setAttribute('name', name)
    input.setAttribute('data-margin-right', 'sm')
    input.value = value
    if (arrayOfSelectedValues.includes(input.value)) {
      input.checked = true
    }
    label.appendChild(input)

    label.appendChild(
      document.createTextNode(
        valueDisplayFunction(node.internalState, value)
      )
    )
    labelColumn.appendChild(label)
    allLabels.push(label)
  })
  const notFoundLabel = document.createElement('div')
  notFoundLabel.innerHTML =
    node.hasAttribute('data-no-results-on-search-message')
      ? node.getAttribute('data-no-results-on-search-message')
      : 'No Results'
  notFoundLabel.style.display = 'none'
  notFoundLabel.setAttribute('data-padding', 'md')
  notFoundLabel.setAttribute('data-font-size', 'md')
  dropdown.appendChild(notFoundLabel)
  multiSelect.appendChild(dropdown)

  if (allLabels.length === 0) {
    notFoundLabel.style.display = 'block'
  }

  searchInput.addEventListener('input', (event) => {
    filterOptions(event.target.value, allLabels)
  })

  searchInput.addEventListener('focus', (event) => {
    dropdown.style.display = ''
  })

  node.parentNode.replaceChild(
    multiSelect, node
  )
  updateListOfSelectedElements(allLabels, listOfSelectedElements)

  function filterOptions(query, items) {
    query = query.toLowerCase()
    let atLeastOneMatches = false
    items.forEach(label => {
      const matched = label.textContent.toLowerCase().includes(query)
        || label.querySelector('input[type="checkbox"]').value.includes(query)
      label.style.display = matched ? '' : 'none'
      if (matched) {
        atLeastOneMatches = true
      }
    })
    if (!atLeastOneMatches) {
      notFoundLabel.style.display = 'block'
    } else {
      notFoundLabel.style.display = 'none'
    }
  }

  if (listOfSelectedElements) {
    const form = listOfSelectedElements.closest('form')
    if (form) {
      form.addEventListener('reset', () => {
        listOfSelectedElements.innerHTML = ''
      })
    }
  }

  function updateListOfSelectedElements(allLabels, listOfSelectedElements) {
    if (multiSelectIsAlwaysOn) {
      return
    }
    listOfSelectedElements.innerHTML = ''
    const allSelectedValues = []
    allLabels.forEach(label => {
      const checkbox = label.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        const chip = document.createElement('span')
        chip.setAttribute('is', 'e-chip')
        chip.setAttribute('data-font-size', 'xs')
        chip.innerText = label.textContent
        if (node.hasAttribute('data-selected-chip-close-icon')) {
          const img = document.createElement('img')
          img.src = node.getAttribute('data-selected-chip-close-icon')
          img.addEventListener('click', (event) => {
            event.preventDefault()
            checkbox.checked = false
            if (!multiSelectIsAlwaysOn) {
              updateListOfSelectedElements(allLabels, listOfSelectedElements)
            }
          })
          chip.appendChild(img)
        }
        listOfSelectedElements.appendChild(chip)
        allSelectedValues.push(label.textContent)
      }
    })
    if (allSelectedValues.length === 0) {
      listOfSelectedElements.style.display = 'none'
    } else {
      listOfSelectedElements.style.display = 'flex'
    }
  }
}
