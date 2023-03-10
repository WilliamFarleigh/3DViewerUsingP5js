let cam;
let currentlyPressingButtons = [];
let world = [];
const CAMERA_ROTATION_SPEED = 0.01;
const MOVE_AMT = 2;
let mouseIsLocked = false;
const RELOAD_MOVE_SPEED = 0.5;
const BLOCK_SIZE = 25;
let displaySizeHeight;
let threeDCanvas;
let TwoDCanvas;

class LocToBlockKey {
    constructor(location, block) {
        this.loc = location;
        this.block = block
    }
}

class Location {
    constructor(x, y, z) {
        this.locX = x;
        this.locY = y;
        this.locZ = z;
    }
}

class Block {
    constructor(colorX, colorY, colorZ) {
        this.colorX = colorX;
        this.colorY = colorY;
        this.colorZ = colorZ;
    }
}
function generateWorld() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 10; k++) {
              let loc = new Location(i*BLOCK_SIZE, k*BLOCK_SIZE, j*BLOCK_SIZE);
              let block = k == 0 ? new Block(0, 255, 0) : new Block(150, 75, 0);
              world.push(new LocToBlockKey(loc, block));
            }
        }
    }
}


function setup() {
  displaySizeHeight = windowHeight > windowWidth * 0.44 ? windowWidth * 0.44 : windowHeight;
  threeDCanvas = createCanvas(windowWidth, displaySizeHeight, WEBGL);
  TwoDCanvas = createCanvas(windowWidth, displaySizeHeight);
  noStroke();
  cam = createCamera(0, 0, 0);
  generateWorld();
  frameRate(60);
}

function windowResized() {
  displaySizeHeight = windowHeight > windowWidth * 0.44 ? windowWidth * 0.44 : windowHeight;
  resizeCanvas(windowWidth, displaySizeHeight);
}

function keyReleased() {
   if (currentlyPressingButtons.includes(keyCode)) {
       currentlyPressingButtons.splice(currentlyPressingButtons.indexOf(keyCode));
   }    
}
function keyPressed() {
    if (!currentlyPressingButtons.includes(keyCode)) {
       currentlyPressingButtons.push(keyCode);
   }
}
function mousePressed() {
  requestPointerLock();
}
function draw() {
  background(0);
  //  box(25, 25, 25);
  for (value of world) {
      if (value instanceof LocToBlockKey) {
          let loc = value["loc"];
          let block = value["block"];
          fill(block["colorX"], block["colorY"], block["colorZ"]);
          translate(loc["locX"], loc["locY"], loc["locZ"]);
          box(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          translate(-loc["locX"], -loc["locY"], -loc["locZ"])
      } else {
          throw new Error("value is not an instance of LocToBlock");
      }
  }
  let yMoved = movedY*CAMERA_ROTATION_SPEED;
  let xMoved = movedX*CAMERA_ROTATION_SPEED;
  if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
      cam.tilt(yMoved);
      cam.pan(-1 * (xMoved));
      if (second() % RELOAD_MOVE_SPEED == 0) {
            for (val of currentlyPressingButtons) {
                if (val == 87) {
                    cam.move(0, 0, -1*MOVE_AMT);
                } else if (val == 83) {
                    cam.move(0, 0, MOVE_AMT);
                } else if (val == 65) {
                    cam.move(-1*MOVE_AMT, 0, 0);
                } else if (val == 68) {
                    cam.move(MOVE_AMT, 0, 0);
                }
            }    
        }
  } else {
      TwoDCanvas.background(127);
      image(TwoDCanvas, 0, 0);
  }
 }