export function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const titleBar = element.querySelector('.title-bar');

    titleBar.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    console.log("Hello from drag.js!")

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
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
