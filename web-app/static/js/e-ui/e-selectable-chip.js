class ESelectableChip extends HTMLElement {
  constructor() {
    super()
    this.selected = false
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
    if (this.hasAttribute('data-value')) {
      this.value = this.getAttribute('data-value')
      this.removeAttribute('data-value')
    }
    if (this.getAttribute('data-selected') === 'true') {
      this.select()
    }
    this.addEventListener('click', (event) => {
      event.preventDefault()
      if (!this.selected) {
        this.select()
      } else {
        this.unselect()
      }
    })
  }

  select() {
    this.selected = true
    this.setAttribute('data-selected', 'true')
  }

  unselect() {
    this.selected = false
    this.removeAttribute('data-selected')
  }
}

customElements.define('e-selectable-chip', ESelectableChip)
