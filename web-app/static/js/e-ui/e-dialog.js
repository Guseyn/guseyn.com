import evaluateActions from '#ehtml/evaluateActions.js'
import getNodeScopedState from '#ehtml/getNodeScopedState.js'

class EDialog extends HTMLDialogElement {
  #wrapper

  constructor() {
    super()
    this.ehtmlActivated = false
  }

  connectedCallback() {
    this.addEventListener(
      'ehtml:activated',
      () => this.#onEHTMLActivated(),
      { once: true }
    )
  }

  #onEHTMLActivated() {
    if (this.ehtmlActivated === true) {
      return
    }
    this.ehtmlActivated = true

    // Create internal wrapper
    this.#wrapper = document.createElement('div')
    
    // Create close button
    if (this.hasAttribute('data-close-icon')) {
      const closeBtn = document.createElement('button')
      closeBtn.type = 'button'
      closeBtn.setAttribute('is', 'e-close-icon')
      closeBtn.setAttribute('aria-label', 'Close dialog')
      
      const iconUrl = this.getAttribute('data-close-icon')
      if (iconUrl) {
        closeBtn.innerHTML = `<img src="${iconUrl}" alt="" aria-hidden="true">`
      }

      closeBtn.onclick = () => this.close()
      this.#wrapper.appendChild(closeBtn)
    }

    // Move existing children into the wrapper
    while (this.firstChild) {
      this.#wrapper.appendChild(this.firstChild)
    }
    this.appendChild(this.#wrapper)

    // Close on backdrop click
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.close()
      }
    })

    if (this.hasAttribute('data-open-on-load')) {
      const closestTab = this.closest('e-tab')
      if (
        !closestTab ||
        (closestTab && closestTab.getAttribute('data-active') === 'true')
      ) {
        this.showModal()
      }
    }

    window.addEventListener('keydown', (event) => {
      if (this.open && event.key && event.key.toLowerCase() === 'escape') {
        event.preventDefault()
        this.close()
      }
    })
  }

  showModal() {
    this.#lock()
    super.showModal()
    if (this.hasAttribute('data-onopen')) {
      evaluateActions(
        this.getAttribute('data-onopen'),
        this,
        getNodeScopedState(this)
      )
    }
  }

  close(returnValue) {
    super.close(returnValue)
    this.#unlock()
    if (this.hasAttribute('data-onclose')) {
      evaluateActions(
        this.getAttribute('data-onclose'),
        this,
        getNodeScopedState(this)
      )
    }
  }

  #lock() {
    const y = window.scrollY || document.documentElement.scrollTop
    document.body.dataset.prevScrollY = y
    document.body.style.position = 'fixed'
    document.body.style.top = `-${y}px`
    document.body.style.width = '100%'
  }

  #unlock() {
    const y = parseInt(document.body.dataset.prevScrollY || '0', 10)
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.removeAttribute('data-prev-scroll-y')
    window.scrollTo({ left: 0, top: y, behavior: 'instant' })
  }
}

customElements.define('e-dialog', EDialog, { extends: 'dialog' })
