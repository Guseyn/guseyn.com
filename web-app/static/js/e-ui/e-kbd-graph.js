export default class EKbdGraph extends HTMLElement {
  constructor() {
    super()
    this.ehtmlActivated = false
    this.cursorSelectedElement = null
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
    this.#run()
  }

  #run() {
    if (!this.hasAttribute('data-first-element')) {
      throw new Error('e-kdb-graph must have `data-first-element` attribute')
    }

    const firstElementSelector = this.getAttribute('data-first-element')
    const firstElement = this.querySelector(firstElementSelector)
    this.setCursorToElement(firstElement)

    window.addEventListener('keydown', (event) => {
      if (event.key.startsWith('Arrow')) {
        const cursorSelectedElementIsFocusedAndInput = this.isFocused(this.cursorSelectedElement) &&
          this.isInput(this.cursorSelectedElement)
        if (!cursorSelectedElementIsFocusedAndInput) {
          event.preventDefault()
        }
        if (cursorSelectedElementIsFocusedAndInput) {
          return
        }

        const direction = event.key.split('Arrow')[1].toLowerCase()
        const fromElement = this.cursorSelectedElement
        const toElementSelector = fromElement.getAttribute(`data-${direction}`)
        let toElement
        if (toElementSelector) {
          toElement = this.querySelector(toElementSelector)
          if (toElement) {
            fromElement.removeAttribute('data-cursor-selected')
            this.setCursorToElement(toElement)
          }
        }
      } else if (event.key === 'Enter') {
        if (this.cursorSelectedElement && this.cursorSelectedElement.hasAttribute('data-click-on-enter')) {
          this.cursorSelectedElement.click()
        }
        if (this.cursorSelectedElement && this.isInput(this.cursorSelectedElement)) {
          this.cursorSelectedElement.focus()
        }
      } else if (event.key === 'Escape') {
        if (this.cursorSelectedElement && this.isInput(this.cursorSelectedElement)) {
          this.cursorSelectedElement.blur()
        }
      }
    })

    window.addEventListener('focusin', (e) => {
      if (this.isInput(e.target)) {
        if (
          e.target.hasAttribute('data-left') ||
          e.target.hasAttribute('data-right') ||
          e.target.hasAttribute('data-up') ||
          e.target.hasAttribute('data-down')
        ) {
          this.cursorSelectedElement.removeAttribute('data-cursor-selected')
          this.setCursorToElement(e.target)
        }
      }
    })

    window.addEventListener('click', (e) => {
      if (
        e.target.hasAttribute('data-left') ||
        e.target.hasAttribute('data-right') ||
        e.target.hasAttribute('data-up') ||
        e.target.hasAttribute('data-down')
      ) {
        this.cursorSelectedElement.removeAttribute('data-cursor-selected')
        this.setCursorToElement(e.target)
      }
    })
  }

  setCursorToElement(elm) {
    if (elm) {
      this.cursorSelectedElement = elm
      elm.setAttribute('data-cursor-selected', 'true')
    }
  }

  isFocused(elm) {
    return elm === document.activeElement
  }

  isInput(elm) {
    const tag = elm.tagName.toLowerCase()
    return ['input', 'textarea', 'select'].indexOf(tag) >= 0
  }
}

customElements.define('e-kbd-graph', EKbdGraph)
