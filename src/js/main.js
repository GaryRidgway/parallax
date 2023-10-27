// Get the checkbox
let fpCheckBox;
let eCheckBox;
let kCheckBox;
let lCheckBox;
let zoomSlide;
let lancetWindow;
// Get the output text
let body;
let personSlider;
let person;
let kinect;
let leaves;
let leavesFrame;
let lines;
let scanTo;
let scanFrom;

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
    kCheckBox = document.getElementById("scan");
    lCheckBox = document.getElementById("leaves");

    zoomSlide = document.getElementById("zoom");
    lancetWindow = document.getElementById("window");
    // Get the output text
    body = document.querySelector("body");
    personSlider = document.getElementById("personPosition");
    person = document.getElementById("person");
    kinect = document.getElementById("kinect");
    leaves = document.getElementById("layer1-1");
    leavesFrame = document.querySelector("#layer1-1 iframe");
    lines = document.querySelectorAll(".viewline .texture");

    scanTo = document.querySelectorAll(".kinect-scan.kinect-scan-to");
    scanFrom = document.querySelectorAll(".kinect-scan.kinect-scan-from");

    layer1Tex = document.querySelector("#layer1 .texture");
    layer2Tex = document.querySelector("#layer2 .texture");
    layer3Tex = document.querySelector("#layer3 .texture");
    layer4Tex = document.querySelector("#layer4 .texture");
    layer5Tex = document.querySelector("#layer5 .texture");

    initMovement();
    preCheck();
    leavesProdCheck();
    goFirstPerson();
});

function goFirstPerson() {
    // If the checkbox is checked, display the output text
    makeTransitory(body, 700);
    if (fpCheckBox.checked == true) {
        body.classList.add("first");
    } else {
        body.classList.remove("first");
    }
}

function makeTransitory(element, time) {
  element.classList.add("transitory");
  asyncDelay(time, function () {
    element.classList.remove("transitory");
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
      const scanAngle = scale(angle, 24.724, -24.724, -19.5, 19.5);
      body.style.setProperty("--scan-angle", scanAngle + "deg");
      const scanSlide = scale(angle, 24.724, -24.724, -24, 24);
      body.style.setProperty("--scan-slide", scanSlide + "px");
    });
  
    // const doDamp = parseInt(
    //   getComputedStyle(lancetWindow).getPropertyValue("--do-damp"),
    //   10
    // );
  
    // Above not working yet.
    const doDamp = 1;
  
    const x1Damp = doDamp > 0 ? 0.5 : 1;
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
    eCheckBox.parentElement.classList.add("checked");
    makeTransitory(lancetWindow, 650)
  } else {
    lancetWindow.classList.remove("force-expand");
    eCheckBox.parentElement.classList.remove("checked");
    makeTransitory(lancetWindow, 350)
  }
}

function calcPlanePos(y, angle) {
  const rads = (angle / 180) * Math.PI;
  const tanang = y / Math.tan(-rads);

  return tanang;
}

function hypot(a, b) {
  const leftSum = Math.pow(a, 2) + Math.pow(b, 2);
  const c = Math.sqrt(leftSum);
  return c;
}

function kinectTracking() {
  // If the checkbox is checked, display the output text
  if (kCheckBox.checked == true) {
    kinect.classList.add("show-scan");
    kCheckBox.parentElement.classList.add("checked");
    makeTransitory(lancetWindow, 650)
  } else {
    kinect.classList.remove("show-scan");
    kCheckBox.parentElement.classList.remove("checked");
    makeTransitory(lancetWindow, 350)
  }
}

function displayLeaves() {
  // If the checkbox is checked, display the output text
  if (lCheckBox.checked == true) {
    leaves.classList.add("show-leaves");
    lCheckBox.parentElement.classList.add("checked");
    makeTransitory(leaves, 650)
  } else {
    leaves.classList.remove("show-leaves");
    lCheckBox.parentElement.classList.remove("checked");
    makeTransitory(leaves, 350)
  }
}

function preCheck() {
  forceExpand();
  kinectTracking();
  displayLeaves();
}

function leavesProdCheck() {
  leavesFrame.addEventListener("load", function(event) {
    leavesFrame.contentWindow.checkProd();
  });
}