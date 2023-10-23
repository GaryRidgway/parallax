// Get the checkbox
let fpCheckBox;
let eCheckBox;
let zoomSlide;
let lancetWindow;
// Get the output text
let body;
let personSlider;
let person;
let lines;

let layer1Tex;
let layer2Tex;
let layer3Tex;
let layer4Tex;
let layer5Tex;

document.addEventListener("DOMContentLoaded", function(event) { 
    //do work
    // Get the checkbox
    fpCheckBox = document.getElementById("firstPerson");
    eCheckBox = document.getElementById("expand");
    zoomSlide = document.getElementById("zoom");
    lancetWindow = document.getElementById("window");
    // Get the output text
    body = document.querySelector("body");
    personSlider = document.getElementById("personPosition");
    person = document.getElementById("person");
    lines = document.querySelectorAll(".viewline .texture");

    layer1Tex = document.querySelector("#layer1 .texture");
    layer2Tex = document.querySelector("#layer2 .texture");
    layer3Tex = document.querySelector("#layer3 .texture");
    layer4Tex = document.querySelector("#layer4 .texture");
    layer5Tex = document.querySelector("#layer5 .texture");

    initMovement();

    goFirstPerson();
});

function goFirstPerson() {
    // If the checkbox is checked, display the output text
    triggerFPAnimation();
    if (fpCheckBox.checked == true) {
        body.classList.add("first");
    } else {
        body.classList.remove("first");
    }
}

function triggerFPAnimation() {
    body.classList.add("transitory");
    asyncDelay(700, function () {
        body.classList.remove("transitory");
    });
}

function slidePerson() {
    const pos = personSlider.value;
    const distance = parseFloat(getComputedStyle(body).getPropertyValue("--distance"));
  
    body.style.setProperty("--person-position", pos + "px");
    body.style.setProperty("--hypot", hypot(distance, pos));
    const angle = -(calcAngleDegrees(pos, -354) + 90);
    lines.forEach(function (line) {
      body.style.setProperty("--angle", angle + "deg");
      // line.style.transform = "rotate3d(0, 0, 1, " + angle + "deg)";
    });
  
    // const doDamp = parseInt(
    //   getComputedStyle(lancetWindow).getPropertyValue("--do-damp"),
    //   10
    // );
  
    // Above not working yet.
    const doDamp = 1;
  
    const x1Damp = doDamp > 0 ? 0.35 : 1;
    const x1 = calcPlanePos(100, angle + 90) / x1Damp;
    layer1Tex.style.setProperty("--lateral", -x1 + "px");
  
    const x2Damp = doDamp > 0 ? 1.75 : 1;
    const x2 = calcPlanePos(200, angle + 90) / x2Damp;
    layer2Tex.style.setProperty("--lateral", -x2 + "px");
  
    const x3Damp = doDamp > 0 ? 5 : 1;
    const x3 = calcPlanePos(300, angle + 90) / x3Damp;
    layer3Tex.style.setProperty("--lateral", -x3 + "px");
  
    const x4Damp = doDamp > 0 ? 15 : 1;
    const x4 = calcPlanePos(400, angle + 90) / x4Damp;
    layer4Tex.style.setProperty("--lateral", -x4 + "px");
  
    const x5Damp = doDamp > 0 ? 30 : 1;
    const x5 = calcPlanePos(500, angle + 90) / x5Damp;
    layer5Tex.style.setProperty("--lateral", -x5 + "px");
  }

  function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  function forceExpand() {
    // If the checkbox is checked, display the output text
    if (eCheckBox.checked == true) {
      lancetWindow.classList.add("force-expand");
    } else {
      lancetWindow.classList.remove("force-expand");
    }
  }

  function calcPlanePos(y, angle) {
    const rads = (angle / 180) * Math.PI;
    const tanang = y / Math.tan(-rads);
  
    return tanang;
  }

  function hypot(a, b) {
    console.log(a, b);
    const leftSum = Math.pow(a, 2) + Math.pow(b, 2);
    console.log(leftSum);
    const c = Math.sqrt(leftSum);
    console.log(c);
    return c;
  }