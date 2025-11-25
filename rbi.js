// Variables spécifiques à RBI
let imgRBIcadre, imgAvion, imgPlane, imgRBIRose, imgRBIFleche, imgNDB;
let cap = 0, heading = 0, gisement = 0, rose = 0, HDG = 0;
let QDRvrai = 180, QDMvrai = 0, GT = -180, rot = 180;
let reponse = false;
let canvasWidth, canvasHeight, scaleFactor = 1;
let baseWidth = 1200;
let baseHeight = 700;

class RBISimulation {
    constructor() {
        this.valeurs = {
            cap: 0,
            gisement: 0,
            QDMvrai: 0,
            QDRvrai: 180
        };
    }

    preload() {
        imgRBIcadre = loadImage('../assets/images/RBIcadre.png');
        imgRBIRose = loadImage('../assets/images/RBIrose.png');
        imgRBIFleche = loadImage('../assets/images/RBIFleche.png');
        imgPlane = loadImage('../assets/images/plane.png');
        imgAvion = loadImage('../assets/images/avion.png');
        imgNDB = loadImage('../assets/images/NDB.png');
    }

    setup() {
        const sizes = SimulationUtils.calculateCanvasSize(baseWidth, baseHeight);
        canvasWidth = sizes.width;
        canvasHeight = sizes.height;
        scaleFactor = sizes.scale;
        
        let canvas = createCanvas(canvasWidth, canvasHeight);
        canvas.parent('rbiCanvas');
        imageMode(CENTER);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        textFont('Arial');
        
        this.setupRBIControls();
    }

    setupRBIControls() {
        const buttons = [
            { id: 'randomQDRBtn', handler: () => this.randomQDR() },
            { id: 'randomCapBtn', handler: () => this.randomCap() },
            { id: 'randomBothBtn', handler: () => this.randomBoth() },
            { id: 'toggleReponseBtn', handler: () => this.toggleReponse() },
            { id: 'showTermsBtn', handler: () => document.getElementById('termsModal').classList.add('active') },
            { id: 'showButtonsBtn', handler: () => document.getElementById('buttonsModal').classList.add('active') }
        ];
        
        SimulationUtils.setupButtonEvents(buttons);
        SimulationUtils.setupModalEvents();
    }

    draw() {
        this.RBI();
        this.updateValeurs();
        SimulationUtils.drawAnswers(reponse, this.valeurs);
    }

    RBI() {
        resetMatrix();
        scale(scaleFactor);

        let NDBX = 776;
        let NDBY = 264;
        let GT1 = map(GT, 0, -359, 0, 359);
        QDMvrai = map(GT1, 0, 359, 359, 0);
        heading = GT1 - 180;
        QDRvrai = QDMvrai + rot;
        background(255);

        if (imgRBIcadre) image(imgRBIcadre, 268, 264); else this.drawRBIFrame();
        strokeWeight(Math.max(2 / scaleFactor, 1));
        stroke(0);
        line(NDBX - 100, NDBY, NDBX + 100, NDBY);
        line(NDBX, NDBY - 100, NDBX, NDBY + 100);
        if (imgNDB) image(imgNDB, NDBX, NDBY); else this.drawNDB(NDBX, NDBY);

        if (reponse) {
            push();
            translate(776, 264);
            rotate(radians(-GT1 - 180));
            translate(0, -100);
            rotate(radians(heading));
            rotate(radians(cap));
            if (imgPlane) image(imgPlane, 0, 0); else this.drawPlane();
            pop();
        }

        push();
        translate(268, 264);
        rotate(radians(-rose + 2));
        if (imgRBIRose) image(imgRBIRose, 0, 0); else this.drawRose();
        pop();

        push();
        translate(268, 264);
        rotate(radians(-GT1 - cap));
        if (imgRBIFleche) image(imgRBIFleche, 0, 0); else this.drawFleche();
        pop();

        if (imgAvion) image(imgAvion, 269, 264); else this.drawAvionCentral();
        this.drawCapTriangle();
        this.updateRotations();
    }

    updateValeurs() {
        this.valeurs.cap = cap;
        this.valeurs.gisement = gisement;
        this.valeurs.QDMvrai = QDMvrai;
        this.valeurs.QDRvrai = QDRvrai;
    }

    // ... [Toutes les fonctions de dessin restantes : drawRBIFrame, drawNDB, drawPlane, etc.]
    // Ces fonctions restent identiques à votre code original
    drawRBIFrame() {
        fill(200);
        stroke(0);
        strokeWeight(Math.max(3 / scaleFactor, 1));
        ellipse(268, 264, 536, 536);
        fill(0);
        noStroke();
        for (let i = 0; i < 36; i++) {
            push();
            translate(268, 264);
            rotate(radians(i * 10));
            if (i % 3 === 0) {
                textSize(Math.max(16 / scaleFactor, 12));
                let angle = (360 - (i * 10)) % 360;
                push();
                rotate(radians(-i * 10));
                text(angle, 0, -230);
                pop();
                stroke(0);
                strokeWeight(Math.max(3 / scaleFactor, 1));
                line(0, -250, 0, -268);
            } else {
                stroke(0);
                strokeWeight(Math.max(1 / scaleFactor, 0.5));
                line(0, -260, 0, -268);
            }
            pop();
        }
    }

    drawNDB(x, y) {
        fill(255, 0, 0);
        stroke(0);
        strokeWeight(Math.max(2 / scaleFactor, 1));
        ellipse(x, y, 80, 80);
        fill(255);
        textSize(Math.max(14 / scaleFactor, 10));
        text("NDB", x, y);
    }

    drawPlane() {
        fill(0, 150, 0);
        triangle(-20, 0, 20, 0, 0, -40);
        fill(255);
        triangle(-10, -10, 10, -10, 0, -30);
    }

    drawRose() {
        fill(240);
        stroke(0);
        strokeWeight(Math.max(2 / scaleFactor, 1));
        ellipse(0, 0, 500, 500);
        fill(0);
        noStroke();
        for (let i = 0; i < 36; i++) {
            push();
            rotate(radians(i * 10));
            if (i % 3 === 0) {
                stroke(0);
                strokeWeight(Math.max(2 / scaleFactor, 1));
                line(0, -230, 0, -250);
            } else {
                stroke(0);
                strokeWeight(Math.max(1 / scaleFactor, 0.5));
                line(0, -240, 0, -250);
            }
            pop();
        }
    }

    drawFleche() {
        fill(255, 0, 0);
        noStroke();
        triangle(-10, -250, 10, -250, 0, -200);
        rect(-5, -150, 10, 100);
    }

    drawAvionCentral() {
        fill(0, 0, 255);
        triangle(-15, 0, 15, 0, 0, -30);
        fill(255);
        triangle(-8, -8, 8, -8, 0, -20);
    }

    drawCapTriangle() {
        noStroke();
        fill(255, 255, 0, 185);
        triangle(253, 39, 288, 39, 271, 109);
    }

    updateRotations() {
        if (rose > 360 || rose < 0) rose = 0;
        if (gisement > 359 || gisement < 0) gisement = 0;
        if (GT > -1 || GT < -360) GT = -359;
        if (cap < 0 || cap > 359) cap = 0;
        if (QDMvrai < 180) rot = 180; else if (QDMvrai > 180) rot = -180;
        gisement = QDMvrai - cap;
        if (gisement < 0) gisement += 360;
    }

    mousePressed() {
        const scaledX = mouseX / scaleFactor;
        const scaledY = mouseY / scaleFactor;
        if (scaledX > 229 && scaledX < 307 && scaledY > 587 && scaledY < 614) {
            cap = (cap + 1) % 360;
            return false;
        }
        if (scaledX > 229 && scaledX < 307 && scaledY > 550 && scaledY < 575) {
            GT = (GT - 1) % 360;
            if (GT > -1) GT = -359;
            return false;
        }
        if (scaledX > 408 && scaledX < 508 && scaledY > 404 && scaledY < 504) {
            rose = cap;
            return false;
        }
    }

    touchStarted() {
        const result = this.mousePressed();
        return result === false ? false : true;
    }

    keyPressed() {
        if (key === '1') this.randomQDR();
        else if (key === '2') this.randomCap();
        else if (key === '3') this.randomBoth();
    }

    randomQDR() {
        GT = random(-360, 0);
    }

    randomCap() {
        cap = random(0, 359);
    }

    randomBoth() {
        cap = random(0, 359);
        GT = random(-360, 0);
    }

    toggleReponse() {
        reponse = !reponse;
    }
}

// Initialisation globale
let rbiSimulation;

function preload() {
    rbiSimulation = new RBISimulation();
    rbiSimulation.preload();
}

function setup() {
    rbiSimulation.setup();
}

function draw() {
    rbiSimulation.draw();
}

function mousePressed() {
    return rbiSimulation.mousePressed();
}

function touchStarted() {
    return rbiSimulation.touchStarted();
}

function keyPressed() {
    rbiSimulation.keyPressed();
}

function windowResized() {
    const sizes = SimulationUtils.calculateCanvasSize(baseWidth, baseHeight);
    canvasWidth = sizes.width;
    canvasHeight = sizes.height;
    scaleFactor = sizes.scale;
    resizeCanvas(canvasWidth, canvasHeight);
}