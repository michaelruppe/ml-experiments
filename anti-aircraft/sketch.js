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
      for (let j = planes.length-1; j >= 0; j--) {
        if (gun.projs[i].hits(planes[j])) {
          planes.splice(j,1);
          gun.projs.splice(i,1);
        }
      }
    }
  }



  // Periodically generate planes
  if(counter % 150 == 0) {
    planes.push(new Plane())
  }

  counter++

  // remove offscreen planes
  for(let i = planes.length-1; i >= 0; i--) {
    if (planes[i].offscreen()) planes.splice(i,1);
  }


}


function mouseClicked() {
  for(let gun of guns) {
    gun.shoot();

  }
}
