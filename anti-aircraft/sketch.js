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
let brainJSON;     // the pretrained NeuralNetwork
let pretrained;

// Game mechanics
let passedPlanes = 0; // a failure condition
let counter = 0;
let score = 0;
let bestScore = 0;
let genCounter = 1;
let bestGun;

// User settings & DOM elements
let mode = 'train';
let showTrails = false;
let speed = 1;
let modeSelect;
let speedSelect;
let genText;
let scoreText;



function preload() {
  brainJSON = loadJSON('assets/pretrained.json')
}

function setup() {
  let canvas = createCanvas(800,500);
  canvas.parent('sketch-holder');

  // brainJSON only contains weights and biases. This function creates a real
  // NeuralNetwork object
  pretrained = NeuralNetwork.deserialize(brainJSON);

  for(let i = 0; i < POPULATION; i++) {
    guns.push(new Gun());
  }
  gun = guns[gunIndex]; // select the first gun in the population
  bestGun = gun.brain; // need to instantiate with something cant use the first


  //
  // DOM elements and display styles
  //
  cursor(CROSS);

  genText = createP(' ');
  genText.parent('gen-holder');
  scoreText = createP(' ');
  scoreText.parent('score-holder');


  speedSelect = createSelect();
  speedSelect.position(30, height + 30);
  speedSelect.option('1x');
  speedSelect.option('2x');
  speedSelect.option('3x');
  speedSelect.option('10,000x');
  speedSelect.changed(changeSpeed);

  modeSelect = createSelect();
  modeSelect.position(speedSelect.x + 130, speedSelect.y);
  modeSelect.option('train');
  modeSelect.option('best so far');
  modeSelect.option('pretrained model');
  modeSelect.option('manual');
  modeSelect.changed(changeMode);

  let tracerBox = createCheckbox('Show trails', false);
  tracerBox.position(modeSelect.x + 180, modeSelect.y + modeSelect.height/5);
  tracerBox.changed(toggleTrails);


}

function draw() {

  for (let loops = 0; loops < speed; loops++){

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

    // Speed things along when no planes on-screen (only in auto modes)
    if(planes.length == 0 && mode !== 'manual') {
      counter = 0; // Force new plane to appear on next frame
      gun.resetCooldown();
      gun.projs = [];
    }

  }


  background(135,206,235);
  noStroke(); fill(0);
  textAlign(CENTER); textSize(16); textFont('Georgia');
  text('Speed', speedSelect.x + speedSelect.width/3, speedSelect.y-80);
  text('Mode', modeSelect.x + modeSelect.width/3, modeSelect.y-80);
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



function changeSpeed() {
  let set = speedSelect.value();
  if (set == '1x') {speed = 1;} else
  if (set == '2x') {speed = 2;} else
  if (set == '3x') {speed = 3;} else
  if (set == '10,000x') {speed = 100000;}
}

function toggleTrails() {
  if (this.checked()) {
    showTrails = true;
  } else {
    showTrails = false;
  }
}

function changeMode() {
  mode = modeSelect.value(); // update global mode variable
  if (mode === 'best so far'){
    gun = new Gun(bestGun, color(0, 255, 0) );
  } else if ( mode === 'train') {
    gun = guns[gunIndex];
  } else if ( mode === 'pretrained model') {
    gun = new Gun(pretrained, color(173,255,47));
  } else if ( mode === 'manual') {
    gun = new Gun('manual', color(255,100,0));
  }
  speedSelect.value('1x'); changeSpeed(); // TODO: fix. It's not enough to just set the value, need to call the event function here too;
  gun.projs = [];   // clear projectiles on screen
  planes = [];      // clear planes on screen
  counter = 0;      // generate plane on next frame
  passedPlanes = 0; // reset failure condition
}
