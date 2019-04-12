/*******************************************************************************
 * Neuroevolution of anti-aircraft gun
 *
 *
 ******************************************************************************/

const POPULATION = 1;
let guns = [];
let projs = [];
let planes = [];
let gun;
let savedBirds = []
let counter = 0;
let bestScore = 0;
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
  speedSlider = createSlider(1,100,1);
  speedSlider.parent('slider-holder');

  for(let i = 0; i < POPULATION; i++) guns.push(new Gun());
}


function draw() {
  background(135,206,235);
  for(let gun of guns) {
    gun.update();
    gun.show();
    for(let p of gun.projs) {
      p.update();
      p.show();
    }
  }

  for(let plane of planes){
    plane.update();
    plane.show();

  }

  //hit detection
  for(let gun of guns) {
    for (let i = gun.projs.length-1; i >= 0; i--){

      if (planes.length > 0) { // hack
        // update projectile minimum distance
        let r = gun.projs[i].distanceTo(planes[0]);
        if (r < gun.projs[i].minDistance) {
          gun.projs[i].minDistance = r;
          console.log(gun.projs[i].minDistance);
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
  }



  // Periodically generate planes
  if(counter % 300 == 0) {
    planes.push(new Plane())
  }

  counter++

  // remove offscreen planes
  for(let i = planes.length-1; i >= 0; i--) {
    if (planes[i].offscreen()) planes.splice(i,1);
  }

  // remove offscreen projectiles, accumulating their score to gun
  for(let gun of guns) {
    for (let i = gun.projs.length-1; i >= 0; i--){
      if (gun.projs[i].offscreen()){
        gun.score += map(gun.projs[i].minDistance,0,100,100,0, true);
        gun.projs.splice(i,1);
      }
    }
  }


}


function mouseClicked() {
  for(let gun of guns) {
    gun.shoot();

  }
}
