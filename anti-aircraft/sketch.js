/*******************************************************************************
 * Neuroevolution of anti-aircraft gun
 *
 *
 ******************************************************************************/

const POPULATION = 1000;
let gunIndex = 0;   // testing one gun at a time unhappyface
let guns = [];      // guns that are to be tested
let gun;            // gun currently being tested
let savedGuns = []; // guns already tested that failed
let planes = [];

let passedPlanes = 0; // keep track of how many planes pass the gun
let counter = 0;
let score = 0;
let bestScore = 0;
let bestGun;
let genCounter = 1;
let speedSlider;
let genText;
let scoreText;
let button;
let mode = 'train';



function setup() {
  let canvas = createCanvas(800,500);
  canvas.parent('sketch-holder');
  button = createButton('Now training...');

  textFont('Helvetica'); textSize(12)
  genText = createP(' ');
  genText.parent('gen-holder');
  scoreText = createP(' ');
  scoreText.parent('score-holder');
  speedSlider = createSlider(1,100000,1);
  speedSlider.position(30, height+40)
  button.position(speedSlider.x + speedSlider.width + 30, height+25);
  button.mousePressed(toggleMode);

  for(let i = 0; i < POPULATION; i++) guns.push(new Gun());
  gun = guns[gunIndex]; // select the first gun in the population
  bestGun = gun; // need to instantiate with something cant use the first
}

function draw() {

  for (let loops = 0; loops < speedSlider.value(); loops++){

    // Periodically generate planes
    if(counter++ % 300 == 0) {
      planes.push(new Plane())
    }


    if(planes.length > 0) gun.think(planes); // control the gun
    gun.update();
    for(let p of gun.projs) {
      p.update();
    }

    for(let plane of planes){
      plane.update();
    }

    //hit detection
    for (let i = gun.projs.length-1; i >= 0; i--){

      if (planes.length > 0) { // if planes exist
        // update projectile minimum distance
        let r = gun.projs[i].distanceTo(planes[0]);
        if (r < gun.projs[i].minDistance) {
          gun.projs[i].minDistance = r;
        }
      }

      for (let j = planes.length-1; j >= 0; j--) {
        // Direct hit - apply score bonus and remove projectile, plane
        if (gun.projs[i].hits(planes[j])) {
          // higher reward for earlier kill. avoid case where gun just shoots
          // straight up. the minimum here has been selected carefully to
          // ensure that it's still higher than a close miss
          gun.score += 5 * map(planes[j].x,0,width,200,0) + 120;
          gun.projs.splice(i,1);
          planes.splice(j,1);
          break; // projectile is now gone, so can't check it against other planes
        }
      }
    }

    // remove offscreen projectiles, accumulating their score to gun
    for (let i = gun.projs.length-1; i >= 0; i--){
      if (gun.projs[i].offscreen()){
        // Reward gun for a close miss. Make sure max here is less than any
        // possible score for a direct hit.
        gun.score += map(gun.projs[i].minDistance,0,120,120,0, true);
        gun.projs.splice(i,1);
      }
    }

    // remove offscreen planes
    for(let i = planes.length-1; i >= 0; i--) {
      if (planes[i].offscreen()) {
        planes.splice(i,1);
        passedPlanes++;
      }
    }

    score = gun.score;
    if (mode === 'train'){

      // Update score, save best guns brain
      if(score > bestScore) {
        bestGun = gun.brain;
        bestScore = score;
      }

      // fail the gun if too many planes pass (only when not demoing the best gun)
      if (passedPlanes > 2){
        savedGuns.push( guns.splice(gunIndex,1)[0] );
        passedPlanes = 0;
      }


      // Create new population when all die, clear screen
      if (guns.length === 0) {
        counter = 0;
        genCounter++;
        nextGen();
        planes = [];
      } else {
        gun = guns[gunIndex]; // update the current gun to test
      }

    }

    // Speed things along when no planes on-screen
    if(planes.length == 0) {
      counter = 0; // Force new plane to appear on next frame
      gun.resetCooldown();
    }

  }


  background(135,206,235);
  stroke(0); fill(0);
  textAlign(CENTER); textSize(20)
  text('TimeWarp', speedSlider.x + speedSlider.width/3, height-30);
  genText.html('Generation: ' + genCounter);
  scoreText.html('Current score: ' + nfc(score,0) + '<br> Best score: ' + nfc(bestScore, 0) );

  gun.show();
  for(let p of gun.projs) {
    p.show();
  }
  for(let plane of planes){
    plane.show();
  }



}


function toggleMode() {
  // DEMO THE BEST
  if (mode === 'train'){
    mode = 'showBest'
    button.html('Showing best')
    speedSlider.value(1);
    gun.projs = []; // clear projectiles on screen
    planes = [];
    counter = 0;
    gun = new Gun(bestGun, true);
  } else {
  // CONTINUE TRAINING - reset environment and failure criteria
    mode = 'train'
    button.html('Now training...')
    gun.projs = []; // clear projectiles on screen
    planes = [];
    counter = 0;
    gun = guns[gunIndex];
    passedPlanes = 0;
  }
}
