let windowCount = 0;
let highestZIndex = 100;
const offsetIncrement = 20;
const maxWindowsBeforeBounce = 20

/**
 * make a window draggable
 * @param {HTMLElement} element 
 */
export function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const titleBar = element.querySelector('.title-bar');

    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        highestZIndex++;
        element.style.zIndex = highestZIndex;

        if (!element.dataset.initialDrag) {
            element.dataset.initialLeft = element.style.left;
            element.dataset.initialTop = element.style.top;
            element.dataset.initialDrag = "true";
        }

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }



    function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // Calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Set the element's new position:
    let newTop = element.offsetTop - pos2;
    let newLeft = element.offsetLeft - pos1;

    // Get the boundaries of the body element
    const bodyRect = document.body.getBoundingClientRect();

    // Check if the new position is within the boundaries of the body
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + element.offsetWidth > bodyRect.width) {
        newLeft = bodyRect.width - element.offsetWidth;
    }
    if (newTop + element.offsetHeight > bodyRect.height) {
        newTop = bodyRect.height - element.offsetHeight;
    }

    // Apply the new position
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
}

    function closeDragElement() {
        element.classList.remove('dragging');
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



/**
 * position a window
 * prevents windows from going off screen
 * prevents windows from overlapping
 * @param {HTMLElement} windowElement
 */
export function positionWindow(windowElement) {
    if (windowCount === 0) {
        // do nothing, css style applies
    } else {
        // Adjust the window count for bounce back effect
        let adjustedCount = windowCount % maxWindowsBeforeBounce;

        // offset calculationss
        const offsetX = (window.innerWidth - windowElement.offsetWidth) / 2 + offsetIncrement * adjustedCount;
        const offsetY = (window.innerHeight - windowElement.offsetHeight) / 2 + offsetIncrement * adjustedCount;

        windowElement.style.left = `${offsetX}px`;
        windowElement.style.top = `${offsetY}px`;
        windowElement.style.transform = 'none'; 
    }

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;

    windowCount++;
}


export function makeTitleBar(title) {

        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');
        
        const titleText = document.createElement('h1');
        titleText.classList.add('title-bar-text');
        titleText.textContent = title;
        titleBar.appendChild(titleText);

        return titleBar;
}
