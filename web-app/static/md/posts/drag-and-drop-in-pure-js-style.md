# Drag&Drop and Drag&Resize in Pure JS Style
<div class="date">20 December 2017</div>

Although there are a lot of libraries doing such simple things like *drag&drop* and *drag&resize*, sometimes we need to do specific functional interfaces where it's important to understand how these things really work. If you are begginer in js or just curious programmer, this article would be very useful for you (you will learn some tricks in event driven js system and how it works in the whole).

Let's start with *drag&drop*. Consider we have an element in another one where it could be dragged and drop. We would have something like the following html code:

```html
<div id="wrapElm">
    <div id="elm"></div>
</div>
```
and corresponding styles:

```css
#wrapElm {
  width: 300px
  height:300px
  position: absolute
  top:30px
  left:30px
  background: #cc3333
}

#elm {
  width: 90px
  height: 50px
  position: absolute
  top:0px
  left:0px
  background: #00bfff
}
```
You may notice that `wrapElm` and `elm` have absolute positions. But you can use default(static) positions for elements, in that case you have to use `css margin` properties instead of `top` and `left` properties for declaring position of the dragged element. I prefer work with absolute positionated elements, it's just easier and more convenient.

Let's look at useful functions first before moving futher.
      
**1. The current horizontal/vertical position of the scroll bar.** It's very important to get the scroll position in the browser, especially when you have big elements in your interface.

```js
function scrollTopPosition () {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}

function scrollLeftPosition () {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
}
```
**2. Height and width of the browser window.** If you don't have a wrapper element, you might need to use the browser window that limits region for dragging the element.

```js
function clientHeight () {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}

function clientWidth () {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}
```

**3. Coordinates of the most top-and-left point in the document element.** It's also useful when you use the browser window as a wrapper element.

```js
function clientTopPosition () {
  return document.documentElement.clientTop || document.body.clientTop || 0
}

function clientLeftPosition () {
  return document.documentElement.clientLeft || document.body.clientLeft || 0
}
```

**4. Coordinates of the element.** We need to know a start position of the dragged element.

```js
function elmCoordinates (elm) {
  let rect = elm.getBoundingClientRect()
  let clientTop = clientTopPosition()
  let clientLeft = clientLeftPosition()
  let scrollTop = scrollTopPosition()
  let scrollLeft = scrollLeftPosition()
  let top = rect.top - clientTop + scrollTop
  let left = rect.left - clientLeft + scrollLeft
  let bottom = rect.bottom - clientTop + scrollTop
  let right = rect.right - clientLeft + scrollLeft
  return {
     top: Math.round(top),
     left: Math.round(left),
     bottom: Math.round(bottom),
     right: Math.round(right)
  }
}
```

If you want to learn more about window coordinates and how they are calculated, I can suggest you to visit [this page](https://javascript.info/coordinates). Just remember that window coordinates start at the left-upper corner of the window.

**5. Prohibit selection of the text on the dragged element.** If the dragged element contains text, you probably should do it.

```js
function prohibitSelection () {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  }
}
```

The main trick you need to know for implementing such things is that you can invoke one event listener in another one on an element. So, the common scheme looks like this:

```js
document.onmouseup = function () {
    //remove mousemove listener of elm 
}

elm.onmousedown = function (event) {
  let elmMouseMoveEvent = function () {
    //move elm making some calculations
  }
  document.addEventListener('mousemove', elmMouseMoveEvent)
}
```

Event `onmousedown` is needed to be bound to the element itself, not to the document. This solution is more flexible, so that you can use this scheme for several dragged elements. I don't why, but it's better to use function `addEventListener` for `mousemove` event on the document (dragging becomes more smooth). If you know why, please share your ideas in the comments below.
    
In fact it's very simple: while you're clicking on the element, `mousemove` event listener is created, so that you can move the element. And when we invoke `mouseup` event, we just remove all `mousemove` event listeners, so that `mousemove` works only if `mousedown` is invoked.

Let's say we want to make a function `dragAndDrop` with required parameter `elm` and optional parameter `wrapElm` (if it's missed we just use the body element instead).

So, I will write below the full body of `dragAndDrop` function with detailed explanation via comments in the code. I think it's more convenient for readers than explaining different parts of implemntation separately. The following function is also applicable for several dragged elements. 

```js
// All dragged elements
var elms = []

// All zIndexes of elements
var zIndexes = []

// The maximum value of all values of zIndex property among all elements
var maxZIndex = 0

// All mousemove event listeners of all elements 
var mouseMoveEvents = []

function dragAndDrop (elm, wrapElm) {
  /* Push in elms array every dragged element,
     which is applied in this function */ 
  elms.push(elm)
  // Four parameters for limiting region for dragged elements
  let topLimit
  let leftLimit
  let bottomLimit
  let rightLimit
  /*  We also need zIndex of the current element for changing
      this property of the element while we're dragging it
      and restoring zIndex of the element when dragging is stoped */
  let elmZIndex = elm.style.zIndex || 0
  if (wrapElm) {
      // If wrapElm is specified in the arguments of this function
      let wrapElmCrds = elmCoordinates(wrapElm)
      let scrollTop = scrollTopPosition()
      let scrollLeft = scrollLeftPosition()
      topLimit = wrapElmCrds.top + scrollTop
      leftLimit = wrapElmCrds.left + scrollLeft
      bottomLimit = topLimit + wrapElm.offsetHeight
      rightLimit = leftLimit + wrapElm.offsetWidth
  } else {
      // otherwise we calculate limiting values by body element
      topLimit = clientTopPosition()
      leftLimit = clientLeftPosition()
      bottomLimit = clientHeight()
      rightLimit = clientWidth()
  }
  // Also for futher calculations we need height and width of the elm
  let elmHeight = elm.offsetHeight
  let elmWidth = elm.offsetWidth
  document.onmouseup = function() {
    /*  Removing all mousemove event listeners 
        and restoring zIndexes properties to their initial values */
    for (let i = 0 i < elms.length i++) {
      document.removeEventListener('mousemove', mouseMoveEvents[i])
      elms[i].style.zIndex = zIndexes[i]
      elms[i].style.cursor = 'default'
    }
    mouseMoveEvents.length = 0
  }
  elm.onmousedown = function(event) {
    let e = event || window.event
    // If left button of the mouse is pressed
    if ((e.which && e.which == 1) || (e.button && e.button == 1)) {
      // Getting start position of the element
      let elmCrds = elmCoordinates(elm)
      let elmTop = elmCrds.top
      let elmLeft = elmCrds.left
      let elmBottom = elmCrds.bottom
      let elmRight = elmCrds.right
      // Getting start position of the cursor
      let yStart = e.clientY
      let xStart = e.clientX
      /* Calculating distance between start position
         of the cursor and edges of the element */
      let deltaBetweenCursorPositionAndElmTop = yStart - elmTop
      let deltaBetweenCursorPositionAndElmLeft = xStart - elmLeft
      let deltaBetweenCursorPositionAndElmBottom = elmBottom - yStart
      let deltaBetweenCursorPositionAndElmRight = elmRight - xStart
      // Making zIndex of the current element as high as possible
      elm.style.zIndex = maxZIndex + 1
      // Changing cursor type of the element
      elm.style.cursor = 'move'
      // Declaring function for the current elm
      let elmMouseMoveEvent = function(event) {
        let e = event || window.event
        // Not allowing text selection while we're dragging the element
        prohibitSelection()
        // Getting current scroll position (in the moving process)  
        let scrollTop = scrollTopPosition()
        let scrollLeft = scrollLeftPosition()
        // Getting current cursor position (in moving process)
        let curY = e.clientY
        let curX = e.clientX
        // Get distances for moving
        let yMove = elmTop + curY - yStart
        let xMove = elmLeft + curX - xStart
        /*  Calculating current position of the element 
            in end of the movement
            you can't use method elmCoordinates() 
            because element's top and left is not changed yet */
        let curElmTop = curY - deltaBetweenCursorPositionAndElmTop
          + scrollTop
        let curElmLeft = curX - deltaBetweenCursorPositionAndElmLeft
          + scrollLeft
        let curElmBottom = curY + deltaBetweenCursorPositionAndElmBottom 
          + scrollTop
        let curElmRight = curX + deltaBetweenCursorPositionAndElmRight  
          + scrollLeft
        /*  Checking if the dragged element is completely inside
            the wrapper element
            if yes, the element is moving (properties top and left
            is changing)
            otherwise, the element adjoins to the edje 
            of the wrapper element */
        if (curElmTop < topLimit) {
          elm.style.top = '0px'
        } else if (curElmBottom > bottomLimit) {
          elm.style.top = bottomLimit - elmHeight - topLimit + 'px'
        } else {
          elm.style.top = yMove - topLimit + 'px'
        }
        if (curElmLeft < leftLimit) {
          elm.style.left = '0px'
        } else if (curElmRight > rightLimit) {
          elm.style.left = rightLimit - elmWidth - leftLimit + 'px'
        } else {
          elm.style.left = xMove - leftLimit + 'px'
        }
      }
      /*  Adding event listener with function elmMouseMoveEvent() 
          for the document on mousemove with the current element */
      document.addEventListener('mousemove', elmMouseMoveEvent)
      mouseMoveEvents.push(elmMouseMoveEvent)
    }
  }
  // Adding value of zIndex of the current elm into zIndexes 
  zIndexes.push(elm.style.zIndex)
  // Calculating maxZindex considering value of zIndex of the current element
  maxZIndex = zIndexes.reduce(function(a, b) {
    return Math.max(a, b)
  })
}
```

Now let's look at how *drag&resize* could be implemented. Consider the following html template for element that can be dragged&resized.

```html
<div id="elm" style="">
  <div id="resize-drag-elm"></div>
</div>
```

```css
#elm {
  width: 100px; 
  height: 100px;
  position: absolute;
  margin-top: 30px; 
  top: 0px;
  left:400px;
  background: #ff8000; 
}

#resize-drag-elm {
  width: 25px;
  height: 25px;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #d3d3d3;
  cursor: nwse-resize;
}
```

As you can see, `resize-drag-elm` - is the element that you have to drag for resizing the element with id `elm`. Usually it's placed in the right-bottom corner of the main element. So, `dragAndResize` function for this html pattern would be something like this:

```js
/*
  elm - the main element that we want to be resizable,
  resizeDragElm - the element you have to drag for resizing the main element
  minH - the minimal height of the elm
  minW - the minimal width of the elm
*/
function dragAndResize (elm, resizeDragElm, minH, minW) {
  // Setting mousedown event on the resizeDragElm
  resizeDragElm.onmousedown = function (event) {
    let e = event || window.event
    // Removing mousemove event listener
    document.addEventListener('mouseup', function () {
      document.onmousemove = null
      elm.style.cursor = "default"
    })
    // If left button of the mouse is pressed
    if ((e.which && e.which == 1) || (e.button && e.button == 1)) {
      /* Getting values for futher calculations
        (like in the dragAndDrop function) */
        let elmCrds = elmCoordinates(elm);
        let elmHeight = elm.offsetHeight;
        let elmWidth = elm.offsetWidth;
        let yStart = e.clientY;
        let xStart = e.clientX;
        let yLimit = yStart - elmCrds.top;
        let xLimit = xStart - elmCrds.left;
        // Setting mousedown event on the resizeDragElm
        document.onmousemove = function (event) {  
          /* Not allowing text selection while we're dragging
             the resizeDragElm */
          prohibitSelection();
          let e = event || window.event;
          // Get distances for resizing 
          let y = e.clientY - yStart;
          let x = e.clientX - xStart;
          // Calculating newHeight and newWidth
          let newHeight = elmHeight + y;
          let newWidth = elmWidth + x;
          // Changing height and width of the elm considering minH and minW
          if (newHeight >= minH && newWidth >= minW) {
            directCursor(y, x, resizeDragElm);
            elm.style.height = newHeight + 'px';
            elm.style.width = newWidth + 'px';
          }

        }
      }
    return false;
  }
}

// Changing cursor type that depends on direction of resizing
function directCursor (y, x, elm) {
  if ((y >= 0 && x >= 0) || (y <= 0 && x < 0)) {
    elm.style.cursor = 'nwse-resize';
  } else if ((y >= 0 && x < 0) || (y <= 0 && x >= 0)) {
    elm.style.cursor = 'nesw-resize';
  }
}
```

So, that's it. Hope, this article was useful for you. You can find demo [here](https://cdn.guseyn.com(/html/demo/drag-drop-resize.html)) and all code [here](https://github.com/Guseyn/drag_drop_resize) (if you have questions, don't hesitate submiting issue there).

<div class="refs">References</div>

* [Window Coordinates](https://javascript.info/coordinates)
* [Event Listeners](https://www.w3schools.com/js/js_htmldom_eventlistener.asp)
* [Demo](https://cdn.guseyn.com(/html/demo/drag-drop-resize.html))
* [Code](https://github.com/Guseyn/drag_drop_resize)
