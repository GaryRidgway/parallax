let isMouseDown = false;
let mouseStart;
let controlContainer;
let vp;
let floor;

let scrollDiff;
let scrollOffset;
let scrollDampening;
let zoomPercent = 0;
const scrollMin = -1100;
const scrollMax = 600;

function controlDown(event) {
  isMouseDown = true;
  mouseStart = {
    x: event.x,
    y: event.y
  };
  controlContainer = event.target;
  controlContainer.classList.add("grabbing");
}

function controlUp(event) {
  if (isMouseDown) {
    isMouseDown = false;

    let travel = {
      x: -(mouseStart.x - event.x),
      y: -(mouseStart.y - event.y)
    };

    controlContainer.classList.remove("grabbing");
    let currentX = parseFloat(getComputedStyle(controlContainer).getPropertyValue("--x"));
    let currentY = parseFloat(getComputedStyle(controlContainer).getPropertyValue("--y"));
    controlContainer.style.setProperty("--x", currentX + travel.x + "px");
    controlContainer.style.setProperty("--y", currentY + travel.y + "px");
  }
}

document.addEventListener("mouseleave", (event) => {
  controlUp(event);
});
document.addEventListener("mouseup", (event) => {
  controlUp(event);
});

document.addEventListener("mousemove", (event) => {
    if (isMouseDown) {
        controlUp(event);
        controlDown(event);
    }
});

function initMovement() {
    vp = document.getElementById("viewport");
    floor = document.getElementById("floor");

    document
        .querySelector(".trigger")
        .addEventListener("mousedown", (event) => {
        controlDown(event);
    });


    scrollDiff = 0;
    scrollOffset = 0;
    scrollDampening = 1;
    vp.addEventListener(
        "mousewheel",
        function (event) {
          scrollZoom('mouse', event);
          setTransform3dZ();
        },
        false
    );


    scrollZoom();
    setTransform3dZ();
}

function setScrollControl(percent) {
  zoomSlide.value = percent;
}

function scrollZoom(type = null, event = null) {
  if(type === 'mouse' && event) {
    event.preventDefault();
    event.stopPropagation();
    scrollDiff += event.wheelDelta / scrollDampening;
  }
  else if(type === 'slide') {
    scrollDiff = scale(zoomSlide.value, 0, 100, scrollMin, scrollMax);
    setTransform3dZ();
  }

  if(type !== 'slide') {
    scrollDiff = minmax(scrollMin, scrollDiff, scrollMax);
    setScrollControl(scale(scrollDiff, scrollMin, scrollMax, 0, 100));
  }
}

function setTransform3dZ() {
    let scrollFinal = scrollDiff + scrollOffset;
    vp.style.setProperty("--zoom", scrollFinal + "px");
}

function minmax(min, val, max) {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

function scale (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}