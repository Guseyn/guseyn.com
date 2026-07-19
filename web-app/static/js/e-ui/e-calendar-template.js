import evaluateActions from '#ehtml/evaluateActions.js'

class ECalendarTemplate extends HTMLTemplateElement {
  constructor() {
    super()
    this.ehtmlActivated = false
    const Ekbd = customElements.get('e-kbd')
    this.ekbd = Ekbd
    if (!Ekbd) {
      throw new Error(`

<template is="e-calendar"> requires <kbd is="e-kbd">.
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
    initializeCalendar(this)
  }
}

customElements.define('e-calendar', ECalendarTemplate, { extends: 'template' })

let previousWeekIndex = 0

function initializeCalendar(node) {
  const calendarGrid = document.createElement('div')
  calendarGrid.setAttribute('is', 'e-calendar')
  calendarGrid.style.backgroundColor = 'var(--e-surface-bg)'
  calendarGrid.style.padding = '0'
  calendarGrid.style.marginTop = '1rem'
  calendarGrid.style.borderRadius = '1rem'
  calendarGrid.style.boxShadow = 'var(--e-shadow-lg)'

  const calendarGridShadow = calendarGrid.attachShadow({ mode: 'open' })

  const {
    events,
    weekIndex
  } = node.internalState

  const weekDates = getWeekDates(weekIndex)
  const weekDatesPretty = getWeekDatesPretty(weekDates)
  const currentWeekDayNumber = getCurrentWeekDayNumber()

  calendarGrid.shadowRoot.innerHTML = /*html*/`
    <style>
      :host, * {
        --font-size: 16px;
        --accent-attention: red;
      }

      div[data-part="calendar-core"] {
        box-sizing: border-box;
        position: absolute;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        width: 100%;
        height: fit-content;
        box-sizing: border-box;
        position: relative;
        /*border-radius: var(--e-radius-md);*/
        overflow: visible;
        background: #fff;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        ${calendarInitialAnimationState(previousWeekIndex, weekIndex)};
      }

      /* MOBILE — horizontal scrolling, 1-day per view */
      @media (max-width: 768px) {
        div[data-part="calendar-core"] {
          position: relative;
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          width: 100%;
          height: auto;
          box-sizing: border-box;
        }

        div[data-part="calendar-core"]::-webkit-scrollbar {
          display: none;
        }

        div[data-part="calendar-core"] div[data-part="day-column"] {
          min-width: 100%;
          flex-shrink: 0;
          scroll-snap-align: start;
          box-sizing: border-box;
        }
      }

      div[data-part="calendar-wrapper"] {
        box-sizing: border-box;
        position: relative;
        box-shadow: var(--box-shadow-div);
        border-radius: var(--e-radius-md);
        overflow: hidden;
        background: #fff;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        box-shadow: var(--box-shadow-panel);
      }

      div[data-part="calendar-wrapper"]:has(div[data-part="event"]:hover),
      div[data-part="day-column"]:has(div[data-part="current-time-event"]:hover) {
        overflow: visible;
      }

      div[data-part="calendar-wrapper"]::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }

      div[data-part="calendar-wrapper-header"] {
        box-sizing: border-box;
        position: absolute;
        background: #f9f9f9;
        height: 2.8rem;
        width: 100%;
        border-bottom: 1px solid var(--e-border);
      }

      @keyframes calendarAnim {
        to {
          opacity: 1;
          filter: blur(0);
        }
      }

      @keyframes calendarBackAndForthAnim {
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes calendarBackAnim {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(+100%);
        }
      }

      @keyframes calendarForthAnim {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-100%);
        }
      }

      div[data-part="calendar-core"]::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }

      div[data-part="day-column"] {
        border-left: 1px solid var(--e-border);
        box-sizing: border-box;
        overflow: visible;
      }

      @media(max-width: 768px) {
        div[data-part="day-column"] {
          border-left: none;
        }
        div[data-part="day-label"] {
          border-top-left-radius: var(--e-radius-md);
          border-top-right-radius: var(--e-radius-md);
        }
      }

      div[data-part="day-column"][data-week-day="monday"] {
        border-left: none;
      }

      div[data-part="day-label"] {
        font-size: var(--e-font-size-xs);
        text-align: center;
        font-weight: bold;
        padding: 0.25rem 0;
        background: var(--e-muted-bg);
        border-bottom: 1px solid var(--e-border);
        box-sizing: border-box;
      }

      div[data-part="day-label"] span[data-part="smaller"] {
        font-weight: normal;
      }

      div[data-part="day-label"][data-selected="true"] {
        border: 1px solid var(--e-primary);
        background: var(--e-primary-transparent-accent-bg);
      }

      div[data-part="day-label"][data-label="monday-label"] {
        border-top-left-radius: var(--e-radius-md);
      }

      div[data-part="day-label"][data-label="sunday-label"] {
        border-top-right-radius: var(--e-radius-md);
      }

      div[data-part="day-body"] {
        position: relative;
        height: 30rem;
        overflow: auto;
        box-sizing: border-box;
        overflow: visible;
        cursor: pointer;        
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
      }

      div[data-part="day-body"]:not([data-allowed-to-schedule="false"]):hover:not(:has(div[data-part="event"]:hover)) {
        border: 1px dashed var(--e-primary);
        background: repeating-linear-gradient(
          45deg,
          color-mix(in srgb, var(--e-primary), transparent 90%),
          color-mix(in srgb, var(--e-primary), transparent 90%) 10px,
          color-mix(in srgb, var(--e-primary), transparent 95%) 10px,
          color-mix(in srgb, var(--e-primary), transparent 95%) 20px
        );
      }

      div[data-part="day-body"]:not([data-allowed-to-schedule="false"]):not(:has(div[data-part="event"]:hover)):hover::before {
        content: "Click to Schedule or Press  ⇧ + N";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        color: var(--e-muted);
        width: 100%;
        font-size: var(--e-font-size-sm);
        text-align: center;
        z-index: 9;
        padding: var(--e-spacing-sm);
        box-sizing: border-box;
      }

      div[data-part="day-body"][data-allowed-to-schedule="false"] {
        cursor: default;
      }

      div[data-part="day-body"]::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }

      div[data-part="event"] {
        --count: 1;
        --index: 0;
        --color: #000;
        background: color-mix(in srgb, var(--color), white 90%);
        color: var(--e-fg);
        border: 1px solid var(--color);
        position: absolute;
        display: inline-flex;
        gap: var(--e-spacing-xs);
        align-items: center;
        z-index: 100;
        left: 0.1rem;
        right: 0.1rem;
        border-radius: var(--e-radius-3xl);
        font-size: var(--e-font-size-xs);
        vertical-align: center;
        padding: 0.1rem 0.5rem;
        box-sizing: border-box;
        overflow: auto;
        white-space: nowrap;
        cursor: pointer;
        box-sizing: border-box;
        width: calc(100% / var(--count) - var(--e-spacing-sm)); /* subtract a bit for spacing */
        left: calc((100% / var(--count)) * var(--index) + (var(--e-spacing-sm) / 2));
        word-break: no-break;
        text-align: center;
      }

      div[data-part="event"]:hover,
      div[data-part="event"]:focus-visible {
        --color: #000;
        background: color-mix(in srgb, var(--color), transparent 10%);
        color: #fff;
        flex-direction: column;
        z-index: 110;
        gap: var(--e-spacing-3xs);
        line-height: 0.2rem;
        font-size: var(--e-font-size-xs);
        justify-content: center;
        min-height: max-content !important;
        min-width: max-content !important;
        padding: var(--e-spacing-md);
        outline: 2px solid var(--e-primary, #0066cc);
        outline-offset: 2px;
      }

      div[data-part="day-body"]:before:has(div[data-part="event"]:hover),
      div[data-part="day-body"]:before:has(div[data-part="event"]:focus-visible) {
        display: none;
      }

      div[data-part="event"]:hover::before,
      div[data-part="event"]:focus-visible::before {
        background: none;
        border-radius: var(--e-radius-3xl);
        content: "";
        display: block;
        position: absolute;
        pointer-events: none;
      }

      div[data-part="current-time-event"] {
        position: absolute;
        left: 0.1rem;
        right: 0.1rem;
        box-sizing: border-box;
        height: 0.15rem;
        background: var(--accent-attention);
        z-index: 109;
      }

      /* time label */
      div[data-part="current-time-event"]::after {
        content: attr(data-time);
        position: absolute;
        top: -0.8rem;
        right: 0.2rem;
        transform: translateX(-50%);
        color: var(--accent-attention);
        background: color-mix(in srgb, var(--accent-attention), white 90%);
        border: 1px solid var(--accent-attention);
        border-radius: var(--e-radius-xl);
        font-size: var(--e-font-size-2xs);
        font-weight: 500;
        padding: var(--e-spacing-xs);
        white-space: nowrap;
      }

      div[data-part="event"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      div[data-part="event"]::-webkit-scrollbar {
        display: none;
      }

      hr {
        border: 0;
        border-top: 1px solid var(--e-divider);
        width: 100%;
      }
    </style>
    <div data-part="calendar-wrapper">
      <div data-part="calendar-wrapper-header"></div>
      <div data-part="calendar-core">
        <div data-part="day-column" data-week-day="monday" data-week-day-number="1">
          <div
            data-part="day-label"
            data-selected="${(currentWeekDayNumber === 1 && weekIndex === 0) ? 'true' : 'false'}"
            data-label="monday-label"
          >
            <span>Monday</span><br>
            <span data-part="smaller">${weekDatesPretty[0]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="1" data-week-day-date="${weekDates[0]}"></div>
        </div>
        <div data-part="day-column" data-week-day="tuesday" data-week-day-number="2">
          <div 
            data-part="day-label"
            data-selected="${(currentWeekDayNumber === 2 && weekIndex === 0) ? 'true' : 'false'}"
            data-label="tuesday-label">
            <span>Tuesday</span><br>
            <span data-part="smaller">${weekDatesPretty[1]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="2" data-week-day-date="${weekDates[1]}"></div>
        </div>
        <div data-part="day-column" data-week-day="wednesday" data-week-day-number="3">
          <div data-part="day-label" data-selected="${(currentWeekDayNumber === 3 && weekIndex === 0) ? 'true' : 'false'}" data-label="wednesday-label">
            <span>Wednesday</span><br>
            <span data-part="smaller">${weekDatesPretty[2]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="3" data-week-day-date="${weekDates[2]}"></div>
        </div>
        <div data-part="day-column" data-week-day="thursday" data-week-day-number="4">
          <div data-part="day-label" data-selected="${(currentWeekDayNumber === 4 && weekIndex === 0) ? 'true' : 'false'}" data-label="thursday-label">
            <span>Thursday</span><br>
            <span data-part="smaller">${weekDatesPretty[3]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="4" data-week-day-date="${weekDates[3]}"></div>
        </div>
        <div data-part="day-column" data-week-day="friday" data-week-day-number="5">
          <div data-part="day-label" data-selected="${(currentWeekDayNumber === 5 && weekIndex === 0) ? 'true' : 'false'}" data-label="friday-label">
            <span>Friday</span><br>
            <span data-part="smaller">${weekDatesPretty[4]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="5" data-week-day-date="${weekDates[4]}"></div>
        </div>
        <div data-part="day-column" data-week-day="saturday" data-week-day-number="6">
          <div data-part="day-label" data-selected="${(currentWeekDayNumber === 6 && weekIndex === 0) ? 'true' : 'false'}" data-label="saturday-label">
            <span>Saturday</span><br>
            <span data-part="smaller">${weekDatesPretty[5]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="6" data-week-day-date="${weekDates[5]}"></div>
        </div>
        <div data-part="day-column" data-week-day="sunday" data-week-day-number="7">
          <div data-part="day-label" data-selected="${(currentWeekDayNumber === 7 && weekIndex === 0) ? 'true' : 'false'}" data-label="sunday-label">
            <span>Sunday</span><br>
            <span data-part="smaller">${weekDatesPretty[6]}</span>
          </div>
          <div data-part="day-body" data-allowed-to-schedule="${localStorage.getItem('userRoleInSelectedStudio') !== 'student'}" data-week-day-number="7" data-week-day-date="${weekDates[6]}"></div>
        </div>
      </div>
    </div>
  `
  const eventOnclickAction = node.getAttribute('data-event-onclick')
  const dayBodyOnclickAction = node.getAttribute('data-day-body-onclick')
  node.parentNode.replaceChild(calendarGrid, node)

  function addEvent({
    lessonId,
    index,
    count,
    instructorId,
    studentId,
    weekDayInUserTz,
    lessonStartInUserTz,
    lessonEndInUserTz,
    durationBeforeMidnight,
    durationAfterMidnight,
    lessonNextDayMidnightInUserTz,
    part,
    frequency,
    musicSkill,
    instructorEmail,
    instructorFirstName,
    instructorLastName,
    instructorAvatarColor,
    studentEmail,
    studentFirstName,
    studentLastName,
    studentAvatarColor,
    isInPerson
  }) {
    const totalDuration = durationBeforeMidnight + durationAfterMidnight

    let durationInThisLessonPart = durationBeforeMidnight
    let weekDayNumber = weekDayInUserTz
    if (part === 'second') {
      durationInThisLessonPart = durationAfterMidnight
      weekDayNumber += 1
    }
    // skip second part of next week's monday lesson
    if (part === 'second' && weekDayNumber === 7) {
      return
    }
    // skip first part of previous week's sunday lesson
    if (part === 'first' && weekDayNumber === 0) {
      return
    }

    const column = calendarGrid.shadowRoot.querySelector(`[data-part="day-column"][data-week-day-number="${weekDayNumber}"]`)
    const dayBody = column.querySelector('[data-part="day-body"]')
    const calendarHeight = dayBody.offsetHeight
    const pxPerMinute = Number((calendarHeight / 1440).toFixed(3))

    const minEventHeight = pxPerMinute * 60 // 60mins
    const scale = 1.0

    const lessonStartConsideringPart = part === 'first' ? lessonStartInUserTz : lessonNextDayMidnightInUserTz
    const startMinute = getMinutesSinceMidnight(new Date(lessonStartConsideringPart))
    const top = startMinute * pxPerMinute
    let height = Math.max(durationInThisLessonPart * pxPerMinute * scale, minEventHeight * scale)

    if ((top + height) > calendarHeight) {
      height = calendarHeight - top
    }

    const timeRange = formatTimeRangeAmericanStyle(lessonStartInUserTz, totalDuration)
    const uid = localStorage.getItem('userRoleInSelectedStudio') === 'student'
      ? userIdentity(
        instructorFirstName,
        instructorLastName,
        instructorEmail
      )
      : userIdentity(
        studentFirstName,
        studentLastName,
        studentEmail
      )
    const ms = (musicSkill ? (`<span> | ${musicSkill}</span>`) : '')
    const partMention = durationAfterMidnight > 0 ? ` (${part === 'first' ? 'first part' : 'second part'})` : ''
    const label = /*html*/`<span>${timeRange}${partMention}</span> <span>|</span> <span>${uid}${ms}</span>`
    const labelVertical = /*html*/`<span>${timeRange}${partMention}</span> <hr> <b>${uid}${ms}</b>`
    const ariaLabel = `${timeRange}${partMention}, ${uid}${musicSkill ? ', ' + musicSkill : ''}`

    const event = document.createElement('div')
    event.setAttribute('data-part', 'event')
    event.style.top = `${top}px`
    event.style.height = `${height}px`
    event.style.setProperty('--index', index)
    event.style.setProperty('--count', count)
    const eventSolidColor = localStorage.getItem('userRoleInSelectedStudio') === 'student'
      ? instructorAvatarColor
      : studentAvatarColor
    event.style.setProperty('--color', eventSolidColor)
    event.innerHTML = label
    event.setAttribute('data-lesson-id', lessonId)

    function showExpandedLabel() {
      event.innerHTML = labelVertical
    }

    function showCompactLabel() {
      event.innerHTML = label
    }

    let compactLabelTimer

    function cancelCompactLabel() {
      clearTimeout(compactLabelTimer)
    }

    function scheduleCompactLabel() {
      cancelCompactLabel()
      compactLabelTimer = setTimeout(showCompactLabel, 200)
    }

    event.addEventListener('mouseenter', () => {
      cancelCompactLabel()
      showExpandedLabel()
    })
    event.addEventListener('mouseleave', scheduleCompactLabel)

    const lessonDetails = {
      lessonId,
      instructorId,
      studentId,
      weekDayInUserTz,
      lessonStartInUserTz,
      lessonEndInUserTz,
      durationBeforeMidnight,
      durationAfterMidnight,
      lessonNextDayMidnightInUserTz,
      part,
      frequency,
      musicSkill,
      instructorEmail,
      instructorFirstName,
      instructorLastName,
      instructorAvatarColor,
      studentEmail,
      studentFirstName,
      studentLastName,
      studentAvatarColor,
      isInPerson
    }

    if (eventOnclickAction) {
      event.setAttribute('role', 'button')
      event.tabIndex = 0
      event.setAttribute('aria-label', ariaLabel)

      function openEvent(e) {
        e.stopPropagation()
        evaluateActions(
          eventOnclickAction,
          event,
          lessonDetails
        )
      }

      event.addEventListener('mousedown', (e) => {
        if (e.button !== 0) {
          return
        }
        cancelCompactLabel()
        e.preventDefault()
        openEvent(e)
      })

      event.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openEvent(e)
        }
      })

      event.addEventListener('focus', () => {
        setTimeout(showExpandedLabel, 0)
      })
      event.addEventListener('blur', showCompactLabel)
    }

    dayBody.appendChild(event)
  }

  function addCurrentTimeEvent(columnId, startMinute) {
    const column = calendarGrid.shadowRoot.querySelector(`[data-part="day-column"][data-week-day-number="${columnId}"]`)
    const dayBody = column.querySelector('[data-part="day-body"]')
    const calendarHeight = dayBody.offsetHeight
    const pxPerMinute = Number((calendarHeight / 1440).toFixed(3))

    const top = startMinute * pxPerMinute

    const oldEvent = calendarGrid.shadowRoot.querySelector('[data-part="current-time-event"]')
    const event = document.createElement('div')
    event.setAttribute('data-part', 'current-time-event')
    event.style.top = `${top}px`

    if (oldEvent) {
      oldEvent.parentNode.removeChild(oldEvent)
    }
    dayBody.appendChild(event)

    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');

    event.setAttribute('data-time', toAmericanTime(`${hh}:${mm}:00`))
  }

  assignOverlapProps(events) // attaching index, count to each event to handle overlaps  
  events.filter(event => { // mainly to filter out lessons from previous Sunday
    if (event['part'] === 'first') {
      return isInISOWeekWithIndex(event['lesson_start_in_user_tz'], weekIndex)
    }
    if (event['part'] === 'second') {
      return isInISOWeekWithIndex(event['lesson_end_in_user_tz'], weekIndex)
    }
    return false
  }).forEach(event => {
    addEvent({
      lessonId: event['lesson_id'],
      index: event['index'],
      count: event['count'],
      instructorId: event['instructor_id'],
      studentId: event['student_id'],
      weekDayInUserTz: event['week_day_in_user_tz'],
      lessonStartInUserTz: event['lesson_start_in_user_tz'],
      lessonEndInUserTz: event['lesson_end_in_user_tz'],
      durationBeforeMidnight: event['duration_before_midnight'],
      durationAfterMidnight: event['duration_after_midnight'],
      lessonNextDayMidnightInUserTz: event['lesson_next_day_midnight_in_user_tz'],
      part: event['part'],
      frequency: event['frequency'],
      musicSkill: event['music_skill'],
      instructorEmail: event['instructor_email'],
      instructorFirstName: event['instructor_first_name'],
      instructorLastName: event['instructor_last_name'],
      instructorAvatarColor: event['instructor_avatar_color'],
      studentEmail: event['student_email'],
      studentFirstName: event['student_first_name'],
      studentLastName: event['student_last_name'],
      studentAvatarColor: event['student_avatar_color'],
      isInPerson: event['is_in_person']
    })
  })

  if (dayBodyOnclickAction && localStorage.getItem('userRoleInSelectedStudio') !== 'student') {
    const allDayBodies = [...calendarGrid.shadowRoot.querySelectorAll('[data-part="day-body"]')]
    allDayBodies.forEach(body => {
      body.addEventListener('click', () => {
        evaluateActions(
          dayBodyOnclickAction,
          body,
          {
            weekDayNumber: body.getAttribute('data-week-day-number'),
            weekDayDate: body.getAttribute('data-week-day-date')
          }
        )
      })
    })
  }

  if (weekIndex === 0) {
    addCurrentTimeEvent(
      getCurrentWeekDayNumber(),
      getMinutesFromMidnight(),
      'var(--accent-attention)'
    )

    setInterval(() => {
      addCurrentTimeEvent(
        getCurrentWeekDayNumber(),
        getMinutesFromMidnight(),
        'var(--accent-attention)'
      )
    }, 1000)

    calendarGrid.shadowRoot.addEventListener('animationend', () => {
      calendarGrid.shadowRoot.querySelector('div[data-part="day-label"][data-selected="true"]').scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    })
  }
  previousWeekIndex = weekIndex
}

function calendarInitialAnimationState(previousWeekIndex, currentWeekIndex) {
  if (previousWeekIndex === currentWeekIndex) {
    return `
      filter: blur(80rem);
      animation: calendarAnim 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `
  } else if (previousWeekIndex < currentWeekIndex) {
    return `
      opacity: 0.4;
      transform: translateX(100%);
      animation: calendarBackAndForthAnim 0.8s ease-out forwards;
    `
  } else {
    return `
      opacity: 0.4;
      transform: translateX(-100%);
      animation: calendarBackAndForthAnim 0.8s ease-out forwards;
    `
  }
}

function getMinutesFromMidnight(isoDateString = new Date().toISOString()) {
const date = new Date(isoDateString)
  return date.getHours() * 60 + date.getMinutes()
}

function formatTimeRange(startDateIso, durationMinutes) {
  const start = new Date(startDateIso);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const format = (date) =>
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0');

  return `${format(start)} - ${format(end)}, ${durationMinutes} minutes, `
}

function startTime(startDateIso) {
  const date = new Date(startDateIso);

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

function formatTimeRangeAmericanStyle(startDateIso, durationMinutes) {
  const start = new Date(startDateIso);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const format = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours}:${minutes}`;
  }

  return `<b>${format(start)} - ${format(end)}</b>`;
}

function getMinutesSinceMidnight(date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return hours * 60 + minutes;
}

function getCurrentWeekDayNumber() {
  let weekDayNumber = new Date().getDay()
  if (weekDayNumber === 0) {
    return 7
  }
  return weekDayNumber
}

function getWeekDates(weekIndex = 0) {
  const today = new Date()
  const start = new Date(today)
  const dayOfWeek = today.getDay() // 0 (Sunday) to 6 (Saturday)
  
  // Calculate the number of days to subtract to get to the previous Monday
  // If today is Sunday (0), subtract 6 days to get the previous Monday. Otherwise subtract dayOfWeek - 1.
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  start.setDate(start.getDate() - diff + weekIndex * 7)
  start.setHours(0, 0, 0, 0) // Set time to midnight

  const weekDates = [
    start
  ]

  for (let i = 1; i <= 6; i++) {
    const next = new Date(start)
    next.setDate(start.getDate() + i)
    next.setHours(23, 59, 59, 999)
    weekDates.push(
      next
    )
  }
  return weekDates
}

function getWeekDatesPretty(weekDates) {
  return weekDates.map(date => {
    const options = { month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  })
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}

function isInISOWeekWithIndex(targetDate, weekIndex) {
  const today = new Date()
  
  // Adjust JS day indexing (0 for Sunday becomes 7)
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
  
  // Calculate Monday of the current week
  const startOfCurrentWeek = new Date(today)
  startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + 1)
  
  // Shift the start date by the number of weeks provided in weekIndex
  const startOfTargetWeek = new Date(startOfCurrentWeek)
  startOfTargetWeek.setDate(startOfCurrentWeek.getDate() + (weekIndex * 7))
  startOfTargetWeek.setHours(0, 0, 0, 0)

  // Calculate Sunday of that target week
  const endOfTargetWeek = new Date(startOfTargetWeek)
  endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6)
  endOfTargetWeek.setHours(23, 59, 59, 999)

  // Compare the target date against the computed range
  const dateToCheck = new Date(targetDate)
  return dateToCheck >= startOfTargetWeek && dateToCheck <= endOfTargetWeek
}

function assignOverlapProps(events) {
  const overlapRangeInMinutes = 0
  // for each week day
  for (let wd = 1; wd <= 7; wd++) {
    let groups = []
    const intervals = events
      .filter(event => {
        const startDate = new Date(event.lesson_start_in_user_tz)
        const endDate = new Date(event.lesson_end_in_user_tz)
        if (
          event.part === 'first' &&
          event.week_day_in_user_tz === wd
        ) {
          return true
        }
        if (
          event.part === 'second' &&
          (event.week_day_in_user_tz + 1 === wd)
        ) {
          return true
        }
        return false
      })
      .map(event => {
        const range = []
        if (event.part === 'first') {
          range[0] = new Date(event.lesson_start_in_user_tz)
          range[1] = new Date(event.lesson_end_in_user_tz)
        } else {
          range[0] = new Date(event.lesson_next_day_midnight_in_user_tz)
          range[1] = new Date(event.lesson_end_in_user_tz)
        }
        return {
          event, range
        }
      })
    intervals.sort((i1, i2) => {
      return i1.range[0] - i2.range[0]
    })
    if (intervals.length <= 1) {
      groups = [intervals]
    } else {
      let currentGroup = [intervals[0]]
      let currentGroupMaxEnd = intervals[0].range[1]
      for (let i = 1; i < intervals.length; i++) {
        if (intervals[i].range[0] <= addMinutes(currentGroupMaxEnd, overlapRangeInMinutes)) {
          currentGroup.push(intervals[i])
          currentGroupMaxEnd = new Date(Math.max(currentGroupMaxEnd, intervals[i].range[1]))
        } else {
          // No overlap, start a new group
          groups.push(currentGroup)
          currentGroup = [intervals[i]]
          currentGroupMaxEnd = intervals[i].range[1]
        }
      }
      groups.push(currentGroup)
    }
    for (let g = 0; g < groups.length; g++) {
      for (let e = 0; e < groups[g].length; e++) {
        const event = groups[g][e].event
        event.index = e
        event.count = groups[g].length
      }
    }
  }
}
