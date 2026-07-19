class ETab extends HTMLElement {
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
  }
}

class ETabs extends HTMLElement {
  #nav = null

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
    if (this.ehtmlActivated) {
      return
    }
    this.ehtmlActivated = true
    window.addEventListener("hashchange", () => {
      const tabIndexByUrlHash = this.#hashToTabIndex()
      this.selectTab(tabIndexByUrlHash)
    })
    this.#run()
  }

  #run() {
    // we queue the logic, 
    // so we can use conditional templates like <template is="e-if">
    queueMicrotask(() => {
      this.#nav = document.createElement('nav')
      const tabs = this.#getSelfTabs()
      
      tabs.forEach((tab, index) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.textContent = tab.getAttribute('data-title') || `Tab ${index + 1}`
        btn.onclick = () => this.selectTab(index)
        this.#nav.appendChild(btn)
      })

      this.prepend(this.#nav)

      if (this.hasAttribute('data-apply-hash-navigation')) {
        const tabIndexByUrlHash = this.#hashToTabIndex()
        if (tabIndexByUrlHash !== -1) {
          this.selectTab(tabIndexByUrlHash)
        } else if (this.hasAttribute('data-current-tab')) {
          this.selectTab(parseInt(this.getAttribute('data-current-tab')))
        } else {
          this.selectTab(0)
        }
      } else {
        this.selectTab(0)
      }
    })
  }

  selectTab(index) {
    const tabs = this.#getSelfTabs()
    const buttons = this.#nav.querySelectorAll('button')

    if (index < 0 || index >= tabs.length) {
      return
    }

    tabs.forEach((tab, i) => {
      const isActive = i === index
      tab.setAttribute('data-active', isActive)
      if (buttons[i]) {
        buttons[i].setAttribute('data-active', isActive)
      }
    })

    this.setAttribute('data-current-tab', index)

    if (this.hasAttribute('data-apply-hash-navigation')) {
      const selectedTab = tabs[index]
      window.location.hash = this.#titleToHash(
        selectedTab.getAttribute('data-title') || `Tab ${index + 1}`
      )
    }
  }

  #getSelfTabs() {
    return Array(...this.querySelectorAll('e-tab')).filter(tab => tab.closest('e-tabs') === this)
  }

  #titleToHash(title) {
    return title.toLowerCase().replaceAll(/\s+/g, '-')
  }

  #hashToTabIndex() {
    const hash = window.location.hash
    const tabs = this.#getSelfTabs()
    const tabHashes = []
    tabs.forEach((tab, index) => {
      const hash = this.#titleToHash(tab.getAttribute('data-title') || `Tab ${index + 1}`)
      tabHashes.push(`#${hash}`)
    })
    return Math.max(tabHashes.indexOf(hash), 0)
  }
}

customElements.define('e-tab', ETab)
customElements.define('e-tabs', ETabs)
