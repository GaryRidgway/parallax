var s1 = function (sketch) {
    sketch.particles = [];
    sketch.bounceArcs = {};
    sketch.fadePowerFrames = 40;
    sketch.timeSinceLastSpawn = 0;
    sketch.lifetime = 0;
    sketch.numParticles = numParticles;
    sketch.spawnRate = spawnRate;
    sketch.fpsData = {
        fpsValElement: null,
        adjustedNumParticles: null,
        currentNumParticles: null,
        adjustmentCoefficient: null,
        past60Frames: [],
        updateTracker: 10000,
        updateInterval: 0.5,
        averageFPS: 60
    };

    sketch.wind = {
        x: -1,
        y: 0
    };

    sketch.setup = function () {
        sketch.leafCanvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
        sketch.leafCanvas.id('leafCanvas');
        sketch.leafCanvas.parent('canvasSpace');
        sketch.fpsData.fpsValElement = document.querySelector('#leafSim .fps .value');
        sketch.fpsData.spawnRate = document.querySelector('#leafSim .spawnRate .value');
        sketch.fpsData.adjustedNumParticles = document.querySelector('#leafSim .max-particles .value');
        sketch.fpsData.currentNumParticles = document.querySelector('#leafSim .particles .value');
    };

    sketch.draw = function () {
        sketch.replaceFPS();
        if (debug.clearCanvas) {
            sketch.clear();
        }
        else{
            sketch.background(30);
        }
        sketch.particleLoop();
        if(debug.drawSpawnArea) {
            sketch.drawSpawnArea();
        }
        sketch.trackMouse();
        if(debug.bounceArcs) {
            sketch.drawBounceArcs();
        }
        if(debug.allowStop && sketch.mouseIsPressed) {
            sketch.noLoop();
        }
        if(debug.debugPanel && debug.performanceGraph) {
            sketch.drawPerformaceGraph();
        }
    };

    sketch.windowResized = function () {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    sketch.drawSpawnArea = function () {
        sketch.circle(spawnArea.centerX, spawnArea.centerY, spawnArea.radius * 2);
    };

    sketch.trackRadius = 200;
    sketch.eventHorizonRadius = 50;

    sketch.trackMouse = function () {
        return;
        let mouse = {
            x: sketch.mouseX,
            y: sketch.mouseY
        };

        // Try and remove the mouse if at the edge of screen.
        // This will never be perfect in this implementation because of framerate.
        if (
            mouse.x < 5 || mouse.x > window.innerWidth - 8 ||
            mouse.y < 5 || mouse.y > window.innerHeight - 8 
        ) {
            return;
        }
        if (debug.mouseTracking) {
            sketch.push();
            sketch.noStroke();
            // Hex alpha chart
            // https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4
            sketch.fill("#0586ff22");
            sketch.circle(mouse.x, mouse.y, sketch.trackRadius);
            sketch.fill("#0586ffCC");
            sketch.circle(mouse.x, mouse.y, sketch.eventHorizonRadius);
            sketch.pop();
        }
        for (let i = 0; i < sketch.particles.length; i++) {
            let particle = sketch.particles[i];
            let point = {
            x: particle.position.x,
            y: particle.position.y * hScale
            };
            let distance = distanceBetweenPoints(mouse, point) * 2 - particle.size.w;
            if (distance <= sketch.trackRadius) {
            let angle = angleOfPoints(
                { x: mouse.x, y: mouse.y },
                { x: point.x, y: point.y }
            );
            let dVector = {
                x: Math.cos(angle + sketch.PI / 2),
                y: Math.sin(angle + sketch.PI / 2)
            };

            let mouseForcePower = 15;
            let linePower = 0;
            // if the particle distance (sketch.trackRadius >= x > sketch.eventHorizonRadius)
            if (
                sketch.trackRadius >= distance &&
                distance > sketch.eventHorizonRadius
            ) {
                // Apply a force that is stronger as you get closer to the event horizon.
                // Get the parabolic function of the line to graph the distance power.
                // f(x) = ((x-sketch.trackRadius)^2)/((sketch.eventHorizonRadius - sketch.trackRadius)^2)
                let distanceMult =
                Math.pow(distance - sketch.trackRadius, 2) /
                Math.pow(sketch.eventHorizonRadius - sketch.trackRadius, 2);
                linePower = distanceMult;
                particle.addForce(
                dVector.x * mouseForcePower * distanceMult,
                dVector.y * mouseForcePower * distanceMult
                );
            } else if (distance <= sketch.eventHorizonRadius) {
                linePower = 1;
                particle.addForce(
                dVector.x * mouseForcePower,
                dVector.y * mouseForcePower
                );
            }

            if (debug.mouseTracking) {
                sketch.push();
                // Distance arc.
                sketch.push();
                sketch.strokeWeight(1);
                sketch.stroke("#ffc905");
                sketch.fill(
                "rgba(255 , 201, 5, " +
                    Math.min((Math.round(linePower * 10) / 10) * 2, 1) +
                    ")"
                );
                sketch.translate(mouse.x, mouse.y);
                sketch.angleMode(sketch.RADIANS);
                sketch.rotate(angle + sketch.PI / 2);
                sketch.arc(
                0,
                0,
                distance,
                distance,
                -sketch.PI / 20,
                sketch.PI / 20,
                sketch.PIE
                );
                sketch.pop();

                // Power line.
                sketch.push();
                sketch.stroke("#ffc905");
                sketch.strokeWeight(2);
                sketch.line(
                mouse.x,
                mouse.y,
                mouse.x + (dVector.x * sketch.trackRadius) / 2,
                mouse.y + (dVector.y * sketch.trackRadius) / 2
                );
                sketch.pop();

                // Center target.
                sketch.push();
                sketch.translate(point.x, point.y);
                sketch.stroke("#e18351");
                sketch.fill("#f0a962");
                sketch.circle(0, 0, 10);
                sketch.pop();
                sketch.pop();
            }
            }
        }
    };

    sketch.drawBounceArcs = function () {
    // Get the keys of the object.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    let particles = Object.keys(sketch.bounceArcs);
    for (let i = particles.length - 1; i >= 0; i--) {
        let arc = sketch.bounceArcs[particles[i]];
        if (arc.fadePower <= 0) {
        delete arc;
        } else {
        // Draw arc.
        sketch.push();
            sketch.strokeCap(sketch.SQUARE);
            sketch.stroke(
            'rgba(255, 255, 255,'
            + arc.fadePower/sketch.fadePowerFrames +
            ')'
            );
            sketch.strokeWeight(6);
            sketch.noFill();
            sketch.translate(sketch.mouseX, sketch.mouseY);
            sketch.rotate(arc.angle+sketch.PI/2);
            sketch.arc(
            0,
            0,
            sketch.eventHorizonRadius - 6,
            sketch.eventHorizonRadius - 6,
            -sketch.PI / 9,
            sketch.PI / 9
            );

            let speedFade = Math.max(((Math.pow(arc.fadePower, 2)/(sketch.fadePowerFrames/2)) - arc.fadePower), 0);
            sketch.stroke(
            'rgba(255, 255, 255,'
            + speedFade/sketch.fadePowerFrames +
            ')'
            );
            sketch.strokeWeight(8);
            sketch.arc(
            0,
            0,
            sketch.eventHorizonRadius - 18,
            sketch.eventHorizonRadius - 18,
            -sketch.PI / 9,
            sketch.PI / 9
            );
        sketch.pop();

        arc.fadePower--;
        }
    }
    };

    sketch.particleLoop = function () {
        // Particle spawn.
        sketch.timeSinceLastSpawn += sketch.deltaTime;
        sketch.lifetime += sketch.deltaTime;
        if (sketch.timeSinceLastSpawn/1000 >= sketch.spawnRate) {
            if (sketch.particles.length < sketch.numParticles) {
                sketch.particles.push(new particle(sketch, true));
            }
            sketch.timeSinceLastSpawn = 0;
        }

        // Iterate backwards for deletion.
        for (let i = sketch.particles.length - 1; i >= 0; i--) {
            if (sketch.particles[i].deletable()) {
                sketch.particles.splice(i, 1);
            }
        }

        // Iterate forwards for drawing and updating.
        for (let i = 0; i < sketch.particles.length; i++) {
                sketch.particles[i].update(sketch);
                sketch.particles[i].draw(sketch);
        }
    };

    sketch.replaceFPS = function() {
        if (!debug.debugPanel) {
            let leafSim = document.querySelector('#leafSim .debugData');
            leafSim.classList.add('hidden');
            return;
        }

        if (sketch.frameCount === 0){
            return
        }

        let secondsPassed = sketch.deltaTime/1000;
        let CFPS = 1 / secondsPassed;
        sketch.fpsData.updateTracker += secondsPassed;

        // Update the past60Frames.
        let numlast60Frames = sketch.fpsData.past60Frames.length;
        if (numlast60Frames >= 60) {
            sketch.fpsData.past60Frames.splice(0,1);
        }
        sketch.fpsData.past60Frames.push(CFPS);

        // Update the tracker.
        if (sketch.fpsData.updateTracker >= sketch.fpsData.updateInterval) {
            let last60FrameSum = 0;
            let newNumLast60Frames = sketch.fpsData.past60Frames.length;
            for (let i = 0; i < newNumLast60Frames; i++) {
                last60FrameSum += sketch.fpsData.past60Frames[i];
            }
            if (last60FrameSum / newNumLast60Frames !== Infinity) {

                // Auto adjust particles?
                if (autoAdjustParticleAmount) {
                    if (debug.performanceGraph) {
                        sketch.addPerformancePoint();
                    }
                    let rateMultiplier = maxParticlesSpawnRateMultiply(sketch.particles.length, sketch.numParticles);
                    let adjustmentCoefficient = sketch.fpsData.averageFPS / targetFrames;
                    const modSpawnRate = Math.max((
                        Math.max(Math.min(sketch.spawnRate / adjustmentCoefficient, 1), spawnRate / particleRisk) * 2
                        + sketch.spawnRate
                    ) / 3, spawnRateHardcap) / rateMultiplier;
                    sketch.spawnRate = spawnRate * (1-rateMultiplier) + modSpawnRate * rateMultiplier;

                    const modNumParticles = Math.min((
                        Math.min(Math.max(sketch.numParticles * adjustmentCoefficient, 0), particleRisk * numParticles)
                        + sketch.numParticles
                    ) / 2, particleHardcap);
                    sketch.numParticles = Math.min(
                        numParticles * (1-rateMultiplier) + modNumParticles * rateMultiplier,
                        (sketch.lifetime/1000)*(1/sketch.spawnRate)*2
                    );
                }

                sketch.fpsData.averageFPS = Math.floor(last60FrameSum / newNumLast60Frames);
                if (sketch.fpsData.averageFPS !== Infinity) {
                    sketch.fpsData.fpsValElement.innerText = sketch.fpsData.averageFPS;
                    sketch.fpsData.spawnRate.innerText = rRound(1/sketch.spawnRate, 2);
                    sketch.fpsData.adjustedNumParticles.innerText = rRound(sketch.numParticles, 2);
                    sketch.fpsData.currentNumParticles.innerText = rRound(sketch.particles.length, 2);
                }

                // Reset it to 0 so we dont do this all the time.
                sketch.fpsData.updateTracker = 0;
            }
        }
    }

    sketch.performaceGraphData = {};
    
    if(debug.debugPanel && debug.performanceGraph) {
        sketch.performaceGraphData = {
            highestParticleCount: debug.performaceGraphData.baseParticleScaleMax,
            period: debug.performaceGraphData.period,
            hLowerBound: debug.performaceGraphData.horizontalMarkingLowerBound,
            points: [],
            currentRotation: 0
        };
    }
    /* Arguments are to be structured as objects, as such
    * {
    *   modTime: 1234, // In seconds.
    *   particles: 1234 // Tracked at `time`
    *   rotation: 1234
    * }
    */
    sketch.addPerformancePoint = function() {
        // If we track a higher amount of partilces, expand our graphs upper bound.
        const data = sketch.performaceGraphData;
        const particles =  sketch.particles;
        const lifetimeInSeconds = rRound(sketch.lifetime/1000);
        let HPC = data.highestParticleCount;
        if (
            HPC === null ||
            HPC < particles.length
        ) {
            sketch.performaceGraphData.highestParticleCount = particles.length;
        }
        // Add particle data to array of data
        // If the time value is greater than the highest point and the mod time value

        const rotation = Math.floor(lifetimeInSeconds / data.period);
        const dataPointModTime = lifetimeInSeconds % data.period;
        data.currentRotation = Math.max(data.currentRotation, rotation);
        const insertData = graphArrayTruncateAndIndex(data.points, dataPointModTime, rotation);
        data.points.splice(insertData.index, 0, 
            {
                modTime: dataPointModTime,
                rotation: rotation,
                particles: particles.length
            }
        );
        
        if (insertData.truncate > 0) {
            data.points.splice(insertData.index-insertData.truncate, insertData.truncate);
        }

        // Clean the tail entries.
        while(
            data.points.length>2 &&
            data.points[0].rotation - data.points[data.points.length-1].rotation > 1
        ) {
            data.points.splice(data.points.length-1, 1,);
        }

        // Clean the maw entries.
        while(
            data.points.length>2 &&
            (
                data.points[data.points.length-1].rotation - data.points[0].rotation > 0 ||
                (
                    data.points[data.points.length-1].rotation === data.points[0].rotation &&
                    data.points[data.points.length-1].rotation < data.currentRotation
                )
            )
        ) {
            data.points.splice(0, 1,);
        }

        sketch.performaceGraphData = data;
    }

    const hDivision = window.innerWidth/sketch.performaceGraphData.period;
    sketch.drawPerformaceGraph = function() {
        let topPadding = window.innerHeight/2;
        const data = sketch.performaceGraphData;
        const points = data.points;
        let scaledHeight = (window.innerHeight-topPadding)/Math.max(data.highestParticleCount, 1);
        let doBufferedLine = false;
        let bufferedLine = [];

        sketch.push();
            // The plot.
            sketch.push();
                sketch.fill('rgba(43,194,49, .1)');
                sketch.stroke('rgba(43,194,49, .4)');
                sketch.beginShape();
                    sketch.vertex(0,window.innerHeight);
                    if (points.length > 0) {
                        sketch.vertex(0,window.innerHeight-(points[0].particles * scaledHeight));
                    }
                    points.forEach((element, index) => {
                        sketch.vertex(element.modTime*hDivision, window.innerHeight-(element.particles * scaledHeight));

                        if(points[index+1] && element.rotation > points[index+1].rotation) {
                            doBufferedLine = true;
                            bufferedLine= [
                                element.modTime*hDivision, window.innerHeight-data.highestParticleCount*scaledHeight,
                                element.modTime*hDivision, window.innerHeight
                            ]
                            sketch.vertex(element.modTime*hDivision, window.innerHeight-(points[index+1].particles * scaledHeight));
                        }
                        else if (bufferedLine.length === 0 && index === points.length-1) {
                            doBufferedLine = true;
                            bufferedLine= [
                                element.modTime*hDivision, window.innerHeight-data.highestParticleCount*scaledHeight,
                                element.modTime*hDivision, window.innerHeight
                            ]
                            sketch.vertex(element.modTime*hDivision, window.innerHeight);
                        }
                    });
                    
                    if (points.length > 0 && data.currentRotation > 0) {
                        sketch.vertex(window.innerWidth,window.innerHeight-(points[points.length-1].particles * scaledHeight));
                    }
                    sketch.vertex(window.innerWidth,window.innerHeight);
                sketch.endShape();
                if (doBufferedLine) {
                    sketch.push();
                        sketch.strokeCap(sketch.SQUARE);
                        sketch.stroke('rgba(51,255,59, .6)');
                        sketch.strokeWeight(2);
                        sketch.line(
                            bufferedLine[0], bufferedLine[1],
                            bufferedLine[2], bufferedLine[3]
                        );
                    sketch.pop();
                }
            sketch.pop();

            // The Y scale.
            let yPortions = 8;
            let leftPadding = 5;
            let textBottomPadding = 3;
            let vDivision = (window.innerHeight-topPadding)/yPortions;
            sketch.strokeCap(sketch.SQUARE);
            sketch.fill('rgba(255,255,255,.8)')
            sketch.stroke('rgba(255,255,255,.2)')
            sketch.push();
                for (let i = 0; i<yPortions+1; i++) {
                    sketch.text(data.highestParticleCount/yPortions*i, leftPadding, window.innerHeight - (vDivision * i) - textBottomPadding);
                    sketch.line(
                        0, window.innerHeight - (vDivision * i),
                        window.innerWidth, window.innerHeight - (vDivision * i)
                    );
                }
            sketch.pop();

            // The X scale.
            const period = sketch.performaceGraphData.period;
            leftPadding = -3;
            const hLowerBound = data.hLowerBound;
            sketch.push();
            let multiplier = 1;
                if (hDivision < hLowerBound) {
                    multiplier = Math.ceil(hLowerBound/hDivision);
                }
                for (let i = multiplier; i<period+1; i = i + multiplier) {
                    sketch.textAlign(sketch.RIGHT);
                    sketch.text(i, hDivision*i + leftPadding, window.innerHeight - textBottomPadding);
                    sketch.line(
                        hDivision*i, window.innerHeight,
                        hDivision*i, window.innerHeight - (vDivision * yPortions)
                    );
                }
            sketch.pop();

            // Labels.
            sketch.push();
                sketch.textSize(16);
                sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
                sketch.text('Seconds', window.innerWidth/2, window.innerHeight - 20);
                sketch.translate(40, (window.innerHeight-topPadding)/2 + topPadding)
                sketch.rotate(sketch.HALF_PI)
                sketch.text('Particles', 0,0);
            sketch.pop();
        sketch.pop();
    }
};

// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);
