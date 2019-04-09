class Bird {
  constructor(brain) {
    this.y = height/2;
    this.x = 64;
    this.vel = 0;       // vertical velocity
    this.r = 12;        // edge length
    this.gravity = 0.7; // gravity
    this.lift = -11;    // lift force

    this.score = 0;     // raw score, incremented for each frame
    this.fitness = 0;   // fitness to be normalised among population set

    /* The Neural Network
     *   INPUTS [bird.y, closestPipe.x, closestPipeHi, closestPipeLo]
     *   HIDDEN [ User choice ]
     *  OUTPUTS [flap]
     *
     * TODO:
     *  Homework - input multiple pipes for a look-ahead approach. Still relies
     *             on user feature-selection though and probably doesn't
     *             contribute much value. Instead, perhaps:
     *  Homework - Input downsampled game pixels for a more general solution
     */
     if (brain) {
       this.brain = brain.copy();
     } else {
       this.brain = new NeuralNetwork(4, 4, 1); // Every bird needs a brain
       this.brain.setActivationFunction(this.brain.tanh)
     }

  }

  show() {
    rectMode(RADIUS);
    fill(255,50);
    rect(this.x, this.y, this.r, this.r);
  }


  // Control the bird! Make a prediction with the current inputs
  think(pipes) {

    // Find the closest pipe.
    let closest = pipes[0];
    let closestDistance = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x - this.x;
       // don't worry about pipes we've passed. -closest.w because we can be
       // inside the gap in the pipe
      if (d < closestDistance && d > -pipes[i].w - this.r) {
        closestDistance = d;
        closest = pipes[i];
      }
    }

    // normalise inputs and make a prediction
    let inputs = [
      this.y / height,
      //this.vel / 100, // yuck
      closest.x / width,
      closest.bottom / height,
      closest.top / height
    ];
    let output = this.brain.predict(inputs);
    if (output[0] > 0.5) this.up();
  }

  update() {
    this.score++;
    this.vel += this.gravity;
    this.vel *= 0.98; // air resistance
    this.y += this.vel;

    if (this.y + this.r >= height) {
      this.y = height - this.r;
      this.vel = 0;
    } else if (this.y - this.r <= 0) {
      this.y = this.r;
      this.vel = 0;
    }
  }

  up() {
    this.vel += this.lift;
  }

  mutate(mutationFunc) {
    this.brain.mutate(mutationFunc);
  }
}
