import evaluateActions from '#ehtml/evaluateActions.js'
import getNodeScopedState from '#ehtml/getNodeScopedState.js'

class EWeekPicker extends HTMLTemplateElement {
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
    initializeWeekPicker(this)
  }
}

customElements.define('e-week-picker', EWeekPicker, { extends: 'template' })

function initializeWeekPicker (node) {
  const weekPickerBox = document.createElement('div')
  if (node.hasAttribute('data-week-picker-id')) {
    weekPickerBox.setAttribute('id', node.getAttribute('data-week-picker-id'))
  }
  weekPickerBox.setAttribute('is', 'e-row')
  weekPickerBox.setAttribute('data-keep-flex-direction-row-in-mobile', '')
  weekPickerBox.setAttribute('data-gap', 'sm')
  weekPickerBox.setAttribute('data-border', '')
  weekPickerBox.setAttribute('data-border-radius', 'lg')
  weekPickerBox.setAttribute('data-padding', '2xs')
  weekPickerBox.internalState = {
    weekIndex: 0,
    weekRange: getWeekRangeMondayToSunday(0)
  }

  // Prev Week Button
  const prevWeekButton = document.createElement('button')
  prevWeekButton.type = 'button'
  prevWeekButton.setAttribute('is', 'e-with-icon')
  prevWeekButton.setAttribute('data-padding', 'xs')
  prevWeekButton.setAttribute('aria-label', 'Previous week')
  const prevWeekButtonIcon = document.createElement('img')
  prevWeekButtonIcon.src = node.getAttribute('data-prev-icon')
  prevWeekButtonIcon.setAttribute('data-width', '2xs')
  prevWeekButtonIcon.alt = ''
  prevWeekButtonIcon.setAttribute('aria-hidden', 'true')
  prevWeekButton.appendChild(prevWeekButtonIcon)
  weekPickerBox.appendChild(prevWeekButton)

  const weekDisplay = document.createElement('div')
  weekDisplay.setAttribute('data-width', 'full')
  weekDisplay.setAttribute('data-text-align', 'center')
  weekDisplay.setAttribute('data-font-weight', 'bold')
  weekDisplay.innerText = `${getAmericanStyleDate(weekPickerBox.internalState.weekRange.startDate)} - ${getAmericanStyleDate(weekPickerBox.internalState.weekRange.endDate)}`
  weekPickerBox.appendChild(weekDisplay)

  // Next Week Button
  const nextWeekButton = document.createElement('button')
  nextWeekButton.type = 'button'
  nextWeekButton.setAttribute('is', 'e-with-icon')
  nextWeekButton.setAttribute('data-padding', 'xs')
  nextWeekButton.setAttribute('aria-label', 'Next week')
  const nextWeekButtonIcon = document.createElement('img')
  nextWeekButtonIcon.src = node.getAttribute('data-next-icon')
  nextWeekButtonIcon.setAttribute('data-width', '2xs')
  nextWeekButtonIcon.alt = ''
  nextWeekButtonIcon.setAttribute('aria-hidden', 'true')
  nextWeekButton.appendChild(nextWeekButtonIcon)
  weekPickerBox.appendChild(nextWeekButton)

  prevWeekButton.addEventListener('click', () => {
    weekPickerBox.internalState.weekIndex -= 1
    weekPickerBox.internalState.weekRange = getWeekRangeMondayToSunday(
      weekPickerBox.internalState.weekIndex
    )
    weekDisplay.innerText = `${getAmericanStyleDate(weekPickerBox.internalState.weekRange.startDate)} - ${getAmericanStyleDate(weekPickerBox.internalState.weekRange.endDate)}`
    const state = getNodeScopedState(weekPickerBox)
    state.weekIndex = weekPickerBox.internalState.weekIndex
    state.weekRange = weekPickerBox.internalState.weekRange
    if (node.hasAttribute('data-prev-click')) {
      evaluateActions(
        node.getAttribute('data-prev-click'),
        prevWeekButton,
        state
      )
    }
  })

  nextWeekButton.addEventListener('click', () => {
    weekPickerBox.internalState.weekIndex += 1
    weekPickerBox.internalState.weekRange = getWeekRangeMondayToSunday(
      weekPickerBox.internalState.weekIndex
    )
    weekDisplay.innerText = `${getAmericanStyleDate(weekPickerBox.internalState.weekRange.startDate)} - ${getAmericanStyleDate(weekPickerBox.internalState.weekRange.endDate)}`
    const state = getNodeScopedState(weekPickerBox)
    state.weekIndex = weekPickerBox.internalState.weekIndex
    state.weekRange = weekPickerBox.internalState.weekRange
    if (node.hasAttribute('data-next-click')) {
      evaluateActions(
        node.getAttribute('data-next-click'),
        nextWeekButton,
        state
      )
    }
  })

  node.parentNode.replaceChild(
    weekPickerBox, node
  )
}

function getWeekRangeMondayToSunday(weekIndex) {
  const today = new Date()
  const start = new Date(today)
  const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
  
  // Calculate the number of days to subtract to get to the previous Monday
  // If today is Sunday (0), subtract 6 days to get the previous Monday. Otherwise subtract dayOfWeek - 1.
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  start.setDate(start.getDate() - diff + weekIndex * 7)
  start.setHours(0, 0, 0, 0) // Set time to midnight

  const end = new Date(start)
  end.setDate(start.getDate() + 6) // Add 6 days to get Sunday
  end.setHours(23, 59, 59, 999) // Set time to the very end of the day

  return {
    startDate: start,
    endDate: end
  }
}

function getAmericanStyleDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
