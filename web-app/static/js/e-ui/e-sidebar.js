class ESidebar extends HTMLElement {
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
    const isMobile = window.matchMedia('(max-width: 950px)').matches
    if (!isMobile && sessionStorage.getItem('e-sidebar-open')) {
      this.setAttribute('data-state', 'open')
    } else {
      this.setAttribute('data-state', 'closed')
    }
    if (sessionStorage.getItem('eSidebarScrollTop')) {
      this.querySelector('nav').scrollTo(
        {
          top: Number(sessionStorage.getItem('eSidebarScrollTop'))
        }
      )
    }
    if (!isMobile) {
      this.#setupDesktopHover()
    }
    this.#setupMobile()
    this.#saveSidebarNaveScrollTop()
    this.#adjustPaddingOfNav()
    this.#attachResizeOberserverOnNavHeaderAndFooter()
  }

  #setupDesktopHover() {
    this.addEventListener('mouseenter', () => {
      if (localStorage.getItem('sidebarIsPinned') === 'true') {
        return
      }
      if (window.innerWidth > 768) {
        this.open()
      }
    })
  }

  #setupMobile() {
    if (this.hasAttribute('data-mobile-header')) {
      const corner = this.getAttribute('data-mobile-menu-icon-corner') || 'left'
      const iconUrl = this.getAttribute('data-mobile-menu-icon')

      const mobileHeader = document.querySelector(this.getAttribute('data-mobile-header'))
      const btn = document.createElement('button')
      btn.setAttribute('is', 'e-with-icon')
      btn.setAttribute('data-corner', corner)
      btn.type = 'button'
      btn.setAttribute('aria-label', 'Open navigation menu')
      btn.setAttribute('aria-expanded', 'false')
      btn.setAttribute('aria-controls', 'e-sidebar-nav')
      btn.innerHTML = `<img src="${iconUrl}" width="24" alt="" aria-hidden="true">`
      
      btn.onclick = (e) => {
        e.stopPropagation()
        this.getAttribute('data-state') === 'open' ? this.close() : this.open()
      }

      const nav = this.querySelector('nav')
      if (nav && !nav.id) {
        nav.id = 'e-sidebar-nav'
      }

      if (this.getAttribute('data-side') === 'left') {
        mobileHeader.prepend(btn)
      } else {
        mobileHeader.appendChild(btn)
      }

      this.#updateMobileMenuButton(this.getAttribute('data-state') === 'open')

      if (this.hasAttribute('data-mobile-body-overlay')) {
        const mobileBodyOverlay = document.querySelector(
          this.getAttribute('data-mobile-body-overlay')
        )
        mobileBodyOverlay.addEventListener('click', (e) => {
          if (
            this.getAttribute('data-state') === 'open' && 
            !this.contains(e.target) && 
            !btn.contains(e.target)
          ) {
            this.close()
          }
        })
      }
    }
  }

  #saveSidebarNaveScrollTop() {
    const nav = this.querySelector('nav')
    if (nav) {
      nav.addEventListener('scroll', function () {
        sessionStorage.setItem('eSidebarScrollTop', nav.scrollTop)
      })
    }
  }

  #adjustPaddingOfNav() {
    const header = this.querySelector('header')
    const footer = this.querySelector('footer')
    const nav = document.querySelector('nav')
    const additionalOffset = 16
    if (header) {
      nav.style.paddingTop = `${header.offsetHeight + additionalOffset}px`
    }
    if (footer) {
      nav.style.paddingBottom = `${footer.offsetHeight + additionalOffset}px`
    }
  }

  #attachResizeOberserverOnNavHeaderAndFooter() {
    const header = this.querySelector('header')
    const footer = this.querySelector('footer')
    const nav = document.querySelector('nav')
    const resizeObserver = new ResizeObserver(() => {
      this.#adjustPaddingOfNav()
    })
    resizeObserver.observe(header)
    resizeObserver.observe(footer)
  }

  open() {
    this.setAttribute('data-state', 'open')
    sessionStorage.setItem('e-sidebar-open', 'true')
    this.#updateMobileMenuButton(true)
    this.#adjustPaddingOfNav()
  }

  close() {
    this.setAttribute('data-state', 'closed')
    sessionStorage.removeItem('e-sidebar-open')
    this.#updateMobileMenuButton(false)
    this.#adjustPaddingOfNav()
  }

  #updateMobileMenuButton(isOpen) {
    const mobileHeaderSelector = this.getAttribute('data-mobile-header')
    if (!mobileHeaderSelector) {
      return
    }
    const mobileHeader = document.querySelector(mobileHeaderSelector)
    const btn = mobileHeader?.querySelector('button[is="e-with-icon"]')
    if (!btn) {
      return
    }
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    btn.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    )
  }
}

customElements.define('e-sidebar', ESidebar)
