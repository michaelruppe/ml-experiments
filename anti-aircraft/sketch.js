/*******************************************************************************
 * Neuroevolution of anti-aircraft gun
 *
 *
 ******************************************************************************/

const POPULATION = 5000;
let gunIndex = 0;   // testing one gun at a time unhappyface
let guns = [];      // guns that are to be tested
let gun;            // gun currently being tested
let savedGuns = []; // guns already tested that failed
let planes = [];

let passedPlanes = 0; // keep track of how many planes pass the gun
let counter = 0;
let bestScore = 0;
let bestGun;
let genCounter = 1;
let speedSlider;
let genText;
let scoreText;





function setup() {
  let canvas = createCanvas(800,500);
  canvas.parent('sketch-holder');
  genText = createP(' ');
  genText.parent('gen-holder');
  scoreText = createP(' ');
  scoreText.parent('score-holder');
  speedSlider = createSlider(1,100000,1);
  speedSlider.parent('slider-holder');

  for(let i = 0; i < POPULATION; i++) guns.push(new Gun());
  gun = guns[gunIndex]; // select the first gun in the population
  bestGun = guns[guns.length-1]; // need to instantiate with something cant use the first
}


function draw() {
  if(speedSlider.value == 0) {
     gun = bestGun;
  } else {
    gun = guns[gunIndex];
  }
  for (let loops = 0; loops < speedSlider.value(); loops++){

    // Periodically generate planes
    if(counter % 300 == 0) {
      planes.push(new Plane())
    }


    if(planes.length > 0) gun.think(planes); // control the gun
    gun.update();
    // gun.show();
    for(let p of gun.projs) {
      p.update();
      // p.show();
    }

    for(let plane of planes){
      plane.update();
      // plane.show();
    }

    //hit detection
    for (let i = gun.projs.length-1; i >= 0; i--){

      if (planes.length > 0) { // hack
        // update projectile minimum distance
        let r = gun.projs[i].distanceTo(planes[0]);
        if (r < gun.projs[i].minDistance) {
          gun.projs[i].minDistance = r;
        }
      }

      for (let j = planes.length-1; j >= 0; j--) {
        // Direct hit - apply score bonus and remove projectile, plane
        if (gun.projs[i].hits(planes[j])) {
          gun.score += 1000;
          gun.projs.splice(i,1);
          planes.splice(j,1);
          break; // projectile is now gone, so can't check it against other planes
        }
      }
    }

    counter++;

    // remove offscreen projectiles, accumulating their score to gun
    for (let i = gun.projs.length-1; i >= 0; i--){
      if (gun.projs[i].offscreen()){
        gun.score += map(gun.projs[i].minDistance,0,100,100,0, true);
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

    // fail the gun if too many planes pass (only when not demoing the best gun)
    if (passedPlanes > 0 && speedSlider.value() > 1){
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

  background(135,206,235);
  gun.show();
  for(let p of gun.projs) {
    p.show();
  }
  for(let plane of planes){
    plane.show();
  }



}
