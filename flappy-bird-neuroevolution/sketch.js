const POPULATION = 1000;
let birds = [];
let savedBirds = []
let pipes = [];
let counter = 0;
let genCounter = 1;
let speedSlider;



function setup() {
  createCanvas(400,600)
  background(0);
  speedSlider = createSlider(1,100,1);

  for (let i = 0; i < POPULATION; i++){
    birds.push(new Bird());
  }
}


function draw() {
  // Allow user to speed up evolution (skips animating for some number of frames)
  for (let loops = 0; loops < speedSlider.value(); loops++) {
    // generate pipes periodically
    if (counter++ % 150 == 0) pipes.push(new Pipe());

    // step through array backwards to accommodate element removal
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // eliminate failed birds, storing their neural net for later
      for (let j = birds.length-1; j >=0; j--){
        if (pipes[i].hit(birds[j])){
          // hit pipe
           savedBirds.push( birds.splice(j,1)[0] ); // splice returns an array, but we always splice 1 element to take the 0th
         } else if (birds[j].y == height - birds[j].r || birds[j].y == birds[j].r) {
           // hit upper- or lower-bound
           savedBirds.push( birds.splice(j,1)[0] );
         }
      }


      // Remove offscreen pipes
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
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
