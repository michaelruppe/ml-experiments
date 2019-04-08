let bird;
let pipes = [];

function setup() {
  frameRate(60);
  createCanvas(400,600)
  background(0);

  bird = new Bird();
  pipes.push(new Pipe());
}


function draw() {
  background(0);

  // generate pipes periodically
  if (frameCount % 150 == 0) pipes.push(new Pipe());

  // step through array backwards to accommodate element removal
  for (let i = pipes.length-1; i > 0; i--) {
    pipes[i].update();
    pipes[i].show();

    // collision detection
    if (pipes[i].hit(bird)) {
      console.log('hit');
    }

    // Remove offscreen pipes, show onscreen ones
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();

}

// User input
function keyPressed() {
  // apply force to bird
  if (key == " "){
    bird.up();
  }
}
