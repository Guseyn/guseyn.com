class EToast extends HTMLElement {
  #timer = null

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
    this.#setup()
  }

  #setup() {
    const content = this.innerHTML
    const iconSrc = this.getAttribute('data-icon')
    const closeSrc = this.getAttribute('data-close-icon')

    this.innerHTML = ''

    if (iconSrc) {
      const img = document.createElement('img')
      img.src = iconSrc
      img.alt = ''
      img.setAttribute('aria-hidden', 'true')
      this.appendChild(img)
    }

    const body = document.createElement('div')
    body.innerHTML = content
    this.appendChild(body)

    if (closeSrc) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.setAttribute('aria-label', 'Close notification')
      const closeImg = document.createElement('img')
      closeImg.src = closeSrc
      closeImg.alt = ''
      closeImg.setAttribute('aria-hidden', 'true')
      btn.appendChild(closeImg)
      btn.onclick = () => this.close()
      this.appendChild(btn)
    }
  }

  #closeOthers() {
    if (this.hasAttribute('data-dont-close-others')) {
      return
    }
    // Find any toast currently in the 'opening' state and close it
    document.querySelectorAll('e-toast[data-state="opening"]').forEach(toast => {
      if (toast !== this) {
        toast.close()
      }
    })
  }

  open(content, delay) {
    this.#closeOthers()

    if (this.#timer) {
      clearTimeout(this.#timer)
    }

    if (content) {
      this.querySelector('div').innerHTML = content
    }

    this.setAttribute('data-state', 'opening')

    delay = delay || parseFloat(this.getAttribute('data-hide-after-n-seconds'));
    if (!isNaN(delay) && delay > 0) {
      this.#timer = setTimeout(() => {
        this.close()
      }, delay * 1000);
    }
  }

  close() {
    if (this.getAttribute('data-state') !== 'opening') {
      return
    }

    if (this.#timer) {
      clearTimeout(this.#timer)
    }
    
    this.setAttribute('data-state', 'closing')
    
    this.onanimationend = (e) => {
      if (e.animationName === 'e-toast-out') {
        this.removeAttribute('data-state')
      }
    }
  }
}

customElements.define('e-toast', EToast)
