let windowCount = 0
let highestZIndex = 100
const offsetIncrement = 20
const maxWindowsBeforeBounce = 10

/**
 * make a window draggable
 * @param {HTMLElement} element - the window element
 */
export function makeDraggable (element) {
  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0
  const titleBar = element.querySelector('.title-bar')

  // this part bring window to front when we click on it
  element.onmousedown = function (e) {
    if (e.target === titleBar || titleBar.contains(e.target)) {
      dragMouseDown(e)
    }
    // bring window to front
    bringToFront(element)
  }

  /**
   * start dragging the element
   * @param {event} e - the mousedown event
   */
  function dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    highestZIndex++
    element.style.zIndex = highestZIndex

    if (!element.dataset.initialDrag) {
      element.dataset.initialLeft = element.style.left
      element.dataset.initialTop = element.style.top
      element.dataset.initialDrag = 'true'
    }

    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag

    element.classList.add('focused-window')
  }

  /**
   * bring the element to front by increasing its z-index
   * @param {HTMLElement} element - the element to bring to front
   */
  function bringToFront (element) {
    highestZIndex++
    element.style.zIndex = highestZIndex
  }

  /**
   * drag the element
   * @param {event} e - the mousemove event
   */
  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()

    // here we calculate new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY

    let newTop = element.offsetTop - pos2
    let newLeft = element.offsetLeft - pos1

    const bodyRect = document.body.getBoundingClientRect()

    // Check if the new position is within the boundaries of the body
    if (newLeft < 0) newLeft = 0
    if (newTop < 0) newTop = 0
    if (newLeft + element.offsetWidth > bodyRect.width) {
      newLeft = bodyRect.width - element.offsetWidth
    }
    if (newTop + element.offsetHeight > bodyRect.height) {
      newTop = bodyRect.height - element.offsetHeight
    }

    // new window position
    element.style.top = newTop + 'px'
    element.style.left = newLeft + 'px'
  }

  /**
   * stop dragging the element
   */
  function closeDragElement () {
    element.classList.remove('dragging')
    document.onmouseup = null
    document.onmousemove = null
    element.classList.remove('focused-window')
  }
}

/**
 * position a window
 * stack windows on top of each other
 * prevents windows from going off screen
 * prevents windows from overlapping
 * @param {HTMLElement} windowElement - the window element
 */
export function positionWindow (windowElement) {
  const initialX = 30
  const initialY = 30

  // for bounce effect
  const adjustedCount = windowCount % (maxWindowsBeforeBounce)

  // offset calculations
  let offsetX, offsetY
  if (adjustedCount < maxWindowsBeforeBounce) {
    // before we come to limit, stack normal
    offsetX = initialX + offsetIncrement * adjustedCount
    offsetY = initialY + offsetIncrement * adjustedCount
  } else {
    // when we reach the limit, stack to right and down
    const bounceAdjustedCount = adjustedCount - maxWindowsBeforeBounce
    offsetX = initialX + offsetIncrement * (maxWindowsBeforeBounce + bounceAdjustedCount)
    offsetY = initialY + offsetIncrement * (maxWindowsBeforeBounce + bounceAdjustedCount)
  }

  windowElement.style.left = `${offsetX}px`
  windowElement.style.top = `${offsetY}px`
  windowElement.style.transform = 'none'

  highestZIndex++
  windowElement.style.zIndex = highestZIndex

  windowCount++
}

/**
 * make the titlebar for the window
 * close button is added later
 * @param {string} title  - the title of the window
 * @returns {HTMLElement} - the titlebar element
 */
export function makeTitleBar (title) {
  const titleBar = document.createElement('div')
  titleBar.classList.add('title-bar')

  const titleText = document.createElement('p')
  titleText.classList.add('title-bar-text')
  titleText.textContent = title
  titleBar.appendChild(titleText)

  return titleBar
}
