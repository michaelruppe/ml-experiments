class Bird {
  constructor(brain) {
    this.y = height/2;
    this.x = 64;
    this.vel = 0;       // vertical velocity
    this.r = 12;        // edge length
    this.gravity = 0.8; // gravity
    this.lift = -12;    // lift force

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
       this.brain = new NeuralNetwork(5, 8, 1); // Every bird needs a brain
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
    let closest = null;
    let closestDistance = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = pipes[i].x + pipes[i].w - this.x; // distance to the *back* of the pipe considers if we're inside a pipe
       // don't worry about pipes we've passed
      if (d < closestDistance && d > 0) {
        closestDistance = d;
        closest = pipes[i];
      }
    }

    // normalise inputs and make a prediction
    let inputs = [
      this.y / height,
      this.vel / 10,
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

  }

  up() {
    this.vel += this.lift;
  }

  offScreen() {
    return (this.y > height - this.r || this.y < this.r);
  }

  mutate(mutationFunc) {
    this.brain.mutate(mutationFunc);
  }
}
