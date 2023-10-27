function particle(sketch, debugline) {
    
    const leafData = weighted_random(leafAssets, leafAssetsWeights());
    // const leafData = leafAssets[Math.floor(Math.random()*leafAssets.length)];
    this.particleBaseSize = leafData.baseSize * particleBaseSize;
    this.id = makeId();
    this.modifier = debug.randomSize ? Math.random() * particleVariability - particleVariability/2 : 1;
    this.size = {
        w: this.particleBaseSize + this.modifier,
        h: this.particleBaseSize + this.modifier
    };
    this.sizeModified = (this.size.w / this.particleBaseSize) * this.particleBaseSize;

    this.Cd = 0.04;

    // https://www.omnicalculator.com/physics/terminal-velocity?c=USD&v=Rho:1.204!kgm3,g:9.81!mps2,m:0.005!kg,A:0.58!m2,Cd:.04
    this.TVel = 1.874;//m/s
    this.mass = 0.003 * (this.size.w/30) * leafData.massMult;//kg
    this.weight = this.mass * gravity;
    // this.CSA = 0.58; //m^2
    this.dragConsts = 0.02784;

    // Delay before actions to give more randomness to the falling.
    this.frameDelay = Math.floor(Math.random() * 400 * frameDelayMult);

    this.swaySpeed = 0.05 + Math.random() / 10 - 0.05;
    this.swayBreadth = Math.PI / 9;
    this.swayOffset = Math.random() * 100;

    this.velocity = {
        h: 0,
        v: 0,
        total: 0
    };
    if (!debug.stopForces) {
        let rVelH = Math.random() * 2 * startingVelocityMultiplier - startingVelocityMultiplier;
        let rVelV = Math.random() * 2 * startingVelocityMultiplier - startingVelocityMultiplier;
        this.velocity = {
            h: rVelH,
            v: rVelV,
            total: rVelH + rVelV
        };
    }
    this.acceleration = {
        h: 0,
        v: 0
    };
    this.forces = {
        x: [],
        y: []
    };
    this.position = pointInSpawnArea(spawnArea, this.size);
    this.position.y = this.position.y / hScale;
    this.rotation = 0;

    // Initialize html stuff
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
    const leaf = document.createElement("div");
    const leafIMG = document.createElement("img");
    const leafIMGTransformOrigin = document.createElement("div");
    leafIMGTransformOrigin.classList.add('transform-origin');

    leaf.id = this.id;
    leaf.classList = ['leaf'];
    leaf.appendChild(leafIMG);
    leaf.appendChild(leafIMGTransformOrigin);
    leaf.style.left = this.size.w/2 + 'px';
    leaf.style.top = this.size.w/2 + 'px';

    leafIMG.src = leafData.path;
    let scale = true ? 'scale(' + (this.size.w * leafData.imageSizeModifier / 100) + ')' : '';
    let translate = true ? 'translate(' + (-leafData.x) + 'px, ' + (-leafData.y) + 'px)' : '';
    let rotate = true ? 'rotate(' + leafData.r + 'rad)' : '';
    leafIMG.style.left = (-50 - leafData.x) + 'px';
    leafIMG.style.top = (-50 - leafData.y) + 'px';
    leafIMG.style.transformOrigin = (50 + leafData.x) + 'px ' + (50 + leafData.y) + 'px';
    leafIMG.style.transform = scale + ' ' + rotate;


    leafIMGTransformOrigin.style.transform = 'translate(' + leafData.x + 'px, ' + leafData.y + 'px)';
    const canvasCompanion = document.getElementById('canvasCompanion');
    canvasCompanion.appendChild(leaf);

    this.destroy = function() {
        if (leaf) {
            leaf.remove();
        }
    }

    this.update = function (sketch) {
        if (this.frameDelay > 0) {
            this.frameDelay--;
            this.forces = {
                x: [],
                y: []
            };
            return;
        } else {
            if (!debug.stopForces) {
                this.addForce(sketch.wind.x, sketch.wind.y);

                this.applyForces(sketch.deltaTime / 1000);
                this.acceleration.v =
                    (sketch.deltaTime / 1000) *
                    (this.weight - this.drag(this.velocity.v));
            }
            this.velocity.v = Math.min(
                this.velocity.v + this.acceleration.v,
                this.TVel
            );
            let vSign = -1 * Math.sign(this.velocity.v);
            this.velocity.v = this.velocity.v + vSign * this.drag(this.velocity.v);

            this.acceleration.h =
                (sketch.deltaTime / 1000) *
                (this.velocity.h - this.drag(this.velocity.h));
            this.velocity.h = this.velocity.h + this.acceleration.h;
            let hSign = -1 * Math.sign(this.velocity.h);
            this.velocity.h = rRound(
                this.velocity.h + hSign * this.drag(this.velocity.h),
                2
            );

            this.velocity.total = Math.abs(this.velocity.h) + Math.abs(this.velocity.v);

            this.rotation = angleOfPoints(
                { x: 0, y: 0 },
                { x: this.velocity.h, y: this.velocity.v * hScale }
            );

            if (!debug.stopTurbulence) {
                let sway =
                    Math.sin((sketch.frameCount + this.swayOffset) * this.swaySpeed) *
                    this.swayBreadth *
                    turbulenceRatio(this.velocity.total);
                this.rotation += sway;
            }

            // Turning off mouse interaction for non-mouse implementation.
            const interactWithMouse = false;
            if (interactWithMouse) {
                let intersecting = circlesIntersecting(
                    sketch.mouseX,
                    sketch.mouseY,
                    sketch.eventHorizonRadius / 2,
                    this.position.x,
                    this.position.y * hScale,
                    this.size.w / 2
                );

                if (intersecting !== null) {
                    this.position.x += intersecting.x;
                    this.position.y += intersecting.y / hScale;
    
                    sketch.bounceArcs[this.id] = {
                        angle: intersecting.angle,
                        fadePower: sketch.fadePowerFrames
                    };
                };
            }

            this.position.x += this.velocity.h;
            this.position.y += this.velocity.v;
        }
    };

    this.deletable = function () {
        if (
            this.position.y > window.innerHeight / hScale + this.size.h / hScale ||
            this.position.x > window.innerWidth + this.size.w ||
            this.position.y < 0 - this.size.h / hScale ||
            this.position.x < 0 - this.size.w
        ) {
            this.destroy();
            return true;
        } else {
            return false;
        }
    };

    this.draw = function (sketch) {
        let posx = this.position.x;
        let posy = this.position.y * hScale;
        leaf.style.transform = 'translate(' + (posx - this.sizeModified/2) + 'px, ' + (posy - this.sizeModified/2) + 'px) rotate(' + this.rotation + 'rad)';


        if(debug.particles) {
            let normalizedVectorPercentage = vectorNormalize(
                {
                    x: this.velocity.h,
                    y: this.velocity.v * hScale
                },
                true
            );
            sketch.push();

                // Translate to the center of the particle for rotation.
                sketch.translate(posx, posy);
                sketch.rotate(this.rotation);
                sketch.stroke(255);
                sketch.strokeWeight(8);
                sketch.line(
                    0,
                    0,
                    0,
                    Math.max(
                    this.size.h *
                        (normalizedVectorPercentage.x * Math.abs(this.velocity.h / 2)) +
                        normalizedVectorPercentage.y *
                        Math.abs(this.velocity.v * hScale * 12),
                    this.size.h / 2
                    ) - 4
                );
                sketch.stroke(0);
                sketch.strokeWeight(1);
                sketch.fill("#3f8ad1");
                sketch.circle(0, 0, this.size.w);
                sketch.strokeWeight(2);

                sketch.line(
                    -this.size.w * 0.66,
                    this.size.h / 2,
                    this.size.w * 0.66,
                    this.size.h / 2
                );
                sketch.line(
                    0,
                    0,
                    0,
                    Math.max(
                    this.size.h *
                        (normalizedVectorPercentage.x * Math.abs(this.velocity.h / 2)) +
                        normalizedVectorPercentage.y *
                        Math.abs(this.velocity.v * hScale * 12),
                    this.size.h / 2
                    )
                );
            sketch.pop();
        }
    };

    // https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/termv.html
    this.accelerating = function (velocity) {
    let F = rRound(this.weight - this.drag(velocity));
        return F / this.mass > 0;
    };

    // https://www.grc.nasa.gov/www/k-12/rocket/drageq.html#:~:text=The%20drag%20equation%20states%20that,times%20the%20reference%20area%20A.
    this.drag = function (velocity) {
        return this.dragConsts * (Math.pow(velocity, 2) / 2);
    };

    this.addForce = function (x, y) {
        this.forces.x.push(x);
        this.forces.y.push(y / hScale);
    };

    this.applyForces = function (dTime) {
        let hForces = this.forces.x;
        for (let i = 0; i < hForces.length; i++) {
            this.velocity.h += dTime * hForces[i];
        }

        let vForces = this.forces.y;
        for (let i = 0; i < vForces.length; i++) {
            this.velocity.v += dTime * vForces[i];
        }

        this.forces = {
            x: [],
            y: []
        };
    };
}