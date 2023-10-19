let isMouseDown = false;
let mouseStart;
let controlContainer;
let vp;
let floor;

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

    vp.addEventListener(
        "mousewheel",
        function (event) {
            event.preventDefault();
            event.stopPropagation();
            scrollDiff += event.wheelDelta / scrollDampening;
            setTransform3dZ(vp);
        },
        false
    );


    setTransform3dZ(vp);
}


function setTransform3dZ(element) {
    const min = -3200;
    const max = 640;
    scrollDiff = minmax(min, scrollDiff, max);
    let scrollFinal = scrollDiff + scrollOffset;
    element.style.setProperty("--zoom", scrollFinal + "px");
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