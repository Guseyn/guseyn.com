import getNodeScopedState from '#ehtml/getNodeScopedState.js'
import evaluateActions from '#ehtml/evaluateActions.js'

export default class EKbd extends HTMLElement {
  constructor() {
    super()    
    this.ehtmlActivated = false
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      this.#onEHTMLActivated,
      { once: true }
    )
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true

    if (this.hasAttribute('data-action')) {
      this.#parseKeys()
      window.addEventListener('keydown', this.handleKeyDown)
    }
  }

  #parseKeys() {
    const text = this.textContent.trim().toLowerCase()
    // Handle the case where '+' is the key itself (e.g., "Ctrl++")
    let parts
    if (text.endsWith('++')) {
      parts = text.slice(0, -2).split('+').map(p => p.trim()).filter(p => p !== '')
      parts.push('+')
    } else {
      parts = text.split('+').map(p => p.trim())
    }

    this.keys = {
      ctrl: parts.includes('ctrl'),
      shift: parts.includes('shift') || parts.includes('⇧'),
      alt: parts.includes('alt') || parts.includes('option'),
      meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('⌘') || parts.includes('command') || parts.includes('win'),
      key: (k) => {
        return parts.includes(k)
      }
    }
  }

  handleKeyDown(event) {
    const targetTagName = event.target.tagName.toLowerCase()
    if (!this.hasAttribute('data-trigger-in-inputs') && (targetTagName === 'textarea' || targetTagName === 'input')) {
      return
    }

    const keyMatch = event.key ? this.keys.key(event.key.toLowerCase()) : false
    const ctrlMatch = event.ctrlKey === this.keys.ctrl
    const shiftMatch = event.shiftKey === this.keys.shift
    const altMatch = event.altKey === this.keys.alt
    const metaMatch = event.metaKey === this.keys.meta

    // All matches must be true, meaining this.keys must have the same boolean values as event keys
    // false === false => true, true === true => true
    if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
      event.preventDefault()
      const state = getNodeScopedState(this)
      evaluateActions(
        this.getAttribute('data-action'),
        this,
        state
      )
    }
  }
}

customElements.define('e-kbd', EKbd, { extends: 'kbd' })
