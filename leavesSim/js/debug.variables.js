p5.disableFriendlyErrors = true;

// Debug variables
// let debug = {
//     doProdDebug: true,

//     debugPanel: true,
//     particles: false,
//     allowStop: true,
//     stopForces: false,
//     randomSize: true,
//     stopTurbulence: false,
//     bounceArcs: true,
//     mouseTracking: true,
//     drawSpawnArea: true,
//     centerSpawn: false,
//     centerSpawnArea: {
//         centerX: window.innerWidth / 2,
//         centerY: window.innerHeight / 2,
//         radius: 2
//     },
//     clearCanvas: false,

//     // Dependant on the debugPanel.
//     performanceGraph: true,
//     performaceGraphData: {
//         baseParticleScaleMax: 90,
//         period: 2*60,//s
//         horizontalMarkingLowerBound: 20
//     }
// };
if (false) {
    debug = {
        doProdDebug: false,

        debugPanel: true,
        particles: true,
        allowStop: true,
        stopForces: true,
        randomSize: false,
        stopTurbulence: true,
        bounceArcs: true,
        mouseTracking: true,
        drawSpawnArea: false,
        centerSpawn: true,
        centerSpawnArea: {
            centerX: window.innerWidth / 2,
            centerY: window.innerHeight / 2,
            radius: 2
        },
        clearCanvas: false,

        // Dependant on the debugPanel.
        performanceGraph: true,
        performaceGraphData: {
            baseParticleScaleMax: 90,
            period: 1*60,//s
            horizontalMarkingLowerBound: 20
        }
    };
}

let debug = {
    debugPanel:false,
    particles: false,
    allowStop: false,
    stopForces : false,
    stopTurbulence: false,
    bounceArcs: true,
    mouseTracking: false,
    drawSpawnArea: false,
    centerSpawn: false,
    clearCanvas: true,
};

// Just gonna hard set it.
debug = prodDebug;


// function checkProd() {
//     if (debug.doProdDebug) {
//         debug = prodDebug;
//     }
// }
// checkProd();
// asyncDelay(500, function () {
//     checkProd();

//     asyncDelay(500, function () {
//         checkProd();

//         asyncDelay(500, function () {
//             checkProd();

//             asyncDelay(500, function () {
//                 checkProd();
//             });
//         });
//     });
// });

if (debug.centerSpawn) {
    spawnArea = debug.centerSpawnArea;
}
///////////////////
