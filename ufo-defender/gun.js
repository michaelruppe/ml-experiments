class Gun {
  constructor(brain, col) {
    this.baseW = 40;
    this.baseH = 30;
    this.gunL = 40;
    this.gunW = 10;

    this.x = 0.9 * width;
    this.y = height - this.baseH/2;
    this.gunX = this.x;
    this.gunY = this.y-this.baseH/2
    this.gunA = 0;

    this.projs = [];
    this.px;
    this.vx = 3;
    this.py;
    this.g;

    this.score = 0;
    this.color;
    if (col) {
      this.color = col;
    } else {
      this.color = color(127);
    }

    this.cooldown = 0;      // cooldown timer. 0 = ready to shoot
    this.cooldownAmt = 80;   // number of frames to cooldown gun

    /* The Neural Network
     *   INPUTS [planeX, planeY, planeV]
     *   HIDDEN [ User choice ]
     *  OUTPUTS [gunAngle, fireControl]
     */

     // You can pass a NeuralNetwork object or a string to brain.
     if (brain instanceof NeuralNetwork) {
       this.brain = brain.copy();
     } else if (brain === 'manual'){
       this.brain = brain;
     } else {
       this.brain = new NeuralNetwork(4, 8, 2); // Every gun needs a brain
       // this.brain.setActivationFunction(this.brain.tanh)

     }

  }

  show() {
    fill(this.color);
    stroke(0); strokeWeight(1);
    rectMode(CENTER);
    imageMode(CENTER);
    // rect(this.x, this.y, this.baseW, this.baseH);
    push(); translate(this.gunX, this.gunY); rotate(this.gunA + PI);
    // rect(0,0,this.gunW,this.gunL);
    // ellipse(0,this.gunL/2,10,10);
    image(spriteGun, 0, -0.4*this.gunL)
    pop();
    image(spriteGunBody,this.x,this.y)

  }

  // Control the gun! Make a prediction with the current inputs
  think(planes) {
    if (this.brain instanceof NeuralNetwork) {
      // Find the closest plane.
      let closest = null;
      let closestDistance = Infinity;
      for (let i = 0; i < planes.length; i++) {
        let d = this.x - planes[i].x

        if (d < closestDistance && d > 0) {
          closestDistance = d;
          closest = planes[i];
        }
      }
      // only run prediction if a closest plane was actually found
      if (closest) {
        // normalise inputs and make a prediction
        let inputs = [
          closest.x / width,
          closest.y / height,
          closest.v / 10, // TODO check
          this.cooldown,
        ];
        let output = this.brain.predict(inputs);

        // set gun angle
        this.gunA = map(output[0],0,1,-3*PI/2,-PI/2);
        // Fire gun if cooled-down
        if (output[1] > 0.5 && this.cooldown === 0) this.shoot();

      }

    } else if (this.brain === 'manual') {
        // Find gun-angle from mouse position
        let r = ((mouseX-this.gunX)*(mouseX-this.gunX)) + ((mouseY-this.gunY)*(mouseY-this.gunY));
        r = Math.sqrt(r);
        let o = mouseY - this.gunY;
        let a = mouseX - this.gunX;
        this.gunA = atan2(o,a) - PI/2

    }
  }

  update() {
    this.cooldown -= 1/this.cooldownAmt;
    if(this.cooldown < 0) this.cooldown = 0;

  }

  shoot() {
    if (this.cooldown === 0) {
      this.projs.push( new Projectile(createVector(this.gunX,this.gunY), this.gunA+PI/2) );
      this.cooldown = 1;
    }
  }

  calculateScore(plane) {
    // loop through all bullets
    for( let p of projs) {
      // find minimum distance to a plane
      let r = p.distanceTo(plane);
    }

  }

  mutate(mutationFunc) {
    this.brain.mutate(mutationFunc);
  }


  // Tool to manually reset cooldown. Useful for demo'ing the best gun
  resetCooldown() {
    this.cooldown = 0;
  }
}

function mousePressed() {
  if (gun.brain === 'manual') gun.shoot();
}
