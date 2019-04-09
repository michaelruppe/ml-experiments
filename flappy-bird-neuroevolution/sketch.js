/*******************************************************************************
 * Neuroevolution of flappy birds
 *
 * TODO:
 *  - NEAT
 *  - load pretrained
 *  - show highest scoring
 *  - add 'immigration' to the population: new, random agents
 *  - art: background
 *
 ******************************************************************************/

const POPULATION = 500;
let birds = [];
let savedBirds = []
let pipes = [];
let counter = 0;
let bestScore = 0;
let genCounter = 1;
let speedSlider;
let genText;
let scoreText;
let spriteBird;
let spriteBackground;
let spritePipe;


// Save a bird
function keyPressed() {
  if(key == 's'){
    let bird = birds[0];
    saveJSON(bird.brain, 'bird.json');
  }
}


function setup() {
  let canvas = createCanvas(600,500);
  canvas.parent('sketch-holder');
  genText = createP(' ');
  genText.parent('gen-holder');
  scoreText = createP(' ');
  scoreText.parent('score-holder');
  speedSlider = createSlider(1,100,1);
  speedSlider.parent('slider-holder')

  background(0);
  for (let i = 0; i < POPULATION; i++){
    birds.push(new Bird());
  }
}


function draw() {

  // DOM elements
  genText.html('Generation: ' + genCounter);
  scoreText.html('Current score: ' + counter + '<br>  Best score: ' + bestScore);

  // Allow user to speed up evolution (skips animating for some number of frames)
  for (let loops = 0; loops < speedSlider.value(); loops++) {
    // generate pipes periodically
    if (counter++ % 150 == 0) pipes.push(new Pipe());

    // Check everything to do with pipes
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // Eliminate crashed birds, storing their neural net for later
      for (let j = birds.length-1; j >=0; j--){
        if (pipes[i].hit(birds[j])){
          // hit pipe
           savedBirds.push( birds.splice(j,1)[0] ); // splice returns array, one element here
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
        savedBirds.push( birds.splice(i,1)[0] ); // splice returns array, one element here
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

    if(counter > bestScore) bestScore = counter;

  }


  // ***************************************************************************
  // *  ANIMATION
  // ***************************************************************************
  // background(135,206,235);
  background(spriteBackground)
  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }

}

function preload() {
  spriteBird = loadImage('art/bird.png');
  spriteBackground = loadImage('art/background-day.png');
  spritePipe = loadImage('art/pipe-green.png');
}
