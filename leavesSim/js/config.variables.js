// Config variables
let hScale = 6;
let gravity = 9.8 * hScale;
let spawnArea = {
    centerX: window.innerWidth - 100,
    centerY: 100,
    radius: 100
};
let frameDelayMult = 0;


// Leaf vars.
let particleBaseSize = 6;
let particleVariability = 5;
let leafBaseSize = 10;
let startingVelocityMultiplier = 0.5;
let leafAssets = [
    {
        path: "assets/Leaves/B1.png",
        x: 20,
        y: -19,
        r: 2.306,
        baseSize: 1.2,
        imageSizeModifier: 2,
        rWeight: 1,
        massMult: 20
    },
    {
        path: "assets/Leaves/F1.png",
        x: 0,
        y: 4,
        r: 2.306,
        baseSize: 3,
        imageSizeModifier: 1.3,
        rWeight: 1,
        massMult: 3
    },
    {
        path: "assets/Leaves/G1.png",
        x: -13,
        y: -13,
        r: 3.64,
        baseSize: 2,
        imageSizeModifier: 1.7,
        rWeight: 2,
        massMult: 0.9
    },
    {
        path: "assets/Leaves/G2.png",
        x: 0,
        y: -1,
        r: 2.05,
        baseSize: 2,
        imageSizeModifier: 1.7,
        rWeight: 2,
        massMult: 0.9
    },
    {
        path: "assets/Leaves/P1.png",
        x: 0,
        y: -2,
        r: 3.1987,
        baseSize: 1.6,
        imageSizeModifier: 1.2,
        rWeight: 20,
        massMult: 0.7
    },
    {
        path: "assets/Leaves/P2.png",
        x: 0,
        y: 10,
        r: 6.2159,
        baseSize: 1.7,
        imageSizeModifier: 1.6,
        rWeight: 20,
        massMult: 0.7
    },
    {
        path: "assets/Leaves/P3.png",
        x: 0,
        y: -2,
        r: 3.0759,
        baseSize: 1.7,
        imageSizeModifier: 1.2,
        rWeight: 20,
        massMult: 0.7
    },
    {
        path: "assets/Leaves/R1.png",
        x: -5,
        y: -14,
        r: 2.3,
        baseSize: 1.5,
        imageSizeModifier: 1.7,
        rWeight: 2,
        massMult: 0.9
    },
    {
        path: "assets/Leaves/R2.png",
        x: 6,
        y: -10,
        r: 2.3345,
        baseSize: 2,
        imageSizeModifier: 1.7,
        rWeight: 2,
        massMult: 0.9
    },
];

let leafAssetsWeights = function() {
    let weights = [];
    leafAssets.forEach(function(element) {
        weights.push(element.rWeight);
    })
    return weights;
};


let particleRisk = 100;
let limitModifier = 1.5;
// Spawn every spawnRate seconds.
let spawnRate = 0.5;
let spawnRateHardcap = spawnRate / limitModifier;
let numParticles = 75;

let particleHardcap = numParticles * limitModifier;
let autoAdjustParticleAmount = true;
let targetFrames = 59;

const maxParticlesSpawnRateMultiplier = 0.5;
const falloffPower = 2;

// frames to wait in ms before allowing complete control from auto adjust in ms.
const timeBuffer = 10000;
const maxMult = 1;
const minMixRatio = 0.5;

///////////////////
