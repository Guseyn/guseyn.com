class EAutoclickButton extends HTMLButtonElement {
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
    this.#run()
  }

  #run() {
    const conditionToClick = this.getAttribute('data-condition-to-click')

    if (conditionToClick === true || conditionToClick === 'true') {
      this.click()
    }
  }
}

customElements.define('e-autoclick', EAutoclickButton, { extends: 'button' })
