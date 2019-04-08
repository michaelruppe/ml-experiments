class Pipe{
  constructor() {
    this.gap = random(75,130);
    this.top = random(height - this.gap);
    this.bottom = height - this.top - this.gap // *Lengths* not y-ordinates
    this.w = 25;
    this.x = width; // start outside right
    this.speed = 2;
    this.col = color(255,255,255); // colour changes depending on hit-state

  }

  show() {
    fill(this.col);
    rectMode(CORNER)
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, height);
  }

  update() {
    this.x -= this.speed;
  }

  // check if pipe is off the left side of the screen
  // used for removing pipes from array
  offscreen() {
    return (this.x < -this.w);
  }

  // collision detection TODO write function for intersection between circle and rectangle
  hit(bird) {
    if (bird.y-bird.r < this.top || bird.y+bird.r > height-this.bottom) {
      if (bird.x+bird.r >= this.x && bird.x-bird.r <= this.x + this.w) {
        this.col = color(255,0,0);
        return true;
      }
    }
    this.col = color(255,255,255);
    return false;
  }


}
