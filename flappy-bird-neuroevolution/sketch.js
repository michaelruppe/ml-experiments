const POPULATION = 500;
let birds = [];
let savedBirds = []
let pipes = [];
let counter = 0;
let genCounter = 1;
let speedSlider;
let genText;

function keyPressed() {
  if(key == 's'){
    let bird = birds[0];
    saveJSON(bird.brain, 'bird.json');
  }
}


function setup() {
  let canvas = createCanvas(600,500);
  canvas.parent('sketch-holder');
  genText = createP('Generation: <b>' + genCounter + '</b>');
  genText.parent('gen-holder');

  background(0);
  speedSlider = createSlider(1,100,1);
  speedSlider.parent('slider-holder')
  for (let i = 0; i < POPULATION; i++){
    birds.push(new Bird());
  }
}


function draw() {
  // Allow user to speed up evolution (skips animating for some number of frames)
  for (let loops = 0; loops < speedSlider.value(); loops++) {
    // generate pipes periodically
    if (counter++ % 150 == 0) pipes.push(new Pipe());

    // Check everything to do with pipes
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // eliminate failed birds, storing their neural net for later
      for (let j = birds.length-1; j >=0; j--){
        if (pipes[i].hit(birds[j])){
          // hit pipe
           savedBirds.push( birds.splice(j,1)[0] ); // splice returns an array, but we always splice 1 element to take the 0th
         }
      }

      // Remove offscreen pipes
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    // Eliminate off-screen birds, storing their neural net for later
    for (var i = birds.length - 1; i >= 0; i--){
      if (birds[i].offScreen()) {
        savedBirds.push( birds.splice(i,1)[0] );
      }
    }

    // Control the birds
    for (let bird of birds) {
      bird.think(pipes)
      bird.update();
    }

    // Create new population when all die, clear screen
    if (birds.length === 0) {
      counter = 0;
      genCounter++;
      nextGen();
      pipes = [];
    }

    genText.html('Generation: <b>' + genCounter + '</b>');

  }


  // ***************************************************************************
  // *  ANIMATION
  // ***************************************************************************
  background(0);
  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }

}
