class Pipe{
  constructor() {
    this.gap = 125;
    this.top = random(height - this.gap); // y-ordinate of pipe location
    this.bottom = this.top + this.gap
    this.w = 48;
    this.x = width + this.w; // start outside right
    this.speed = 2;
    this.col = color(199,234,70); // colour changes depending on hit-state

  }

  show() {
    fill(this.col);
    rectMode(CORNER)
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height);
  }

  update() {
    this.x -= this.speed;
  }

  // check if pipe is off the left side of the screen
  // used for removing pipes from array
  offscreen() {
    if (this.x < -this.w){
      return true;
    } else {
      return false;
    }
  }

  // collision detection TODO write function for intersection between circle and rectangle
  hit(bird) {
    if (bird.y-bird.r < this.top || bird.y+bird.r > this.bottom) {
      if (bird.x+bird.r >= this.x && bird.x-bird.r <= this.x + this.w) {
        this.col = color(220,20,60); //crimson
        return true;
      }
    }
    return false;
  }
  // hit(bird) {
  //   if (bird.y < this.top || bird.y > this.bottom) {
  //     if (bird.x >= this.x && bird.x <= this.x + this.w) {
  //       this.col = color(255,0,0);
  //       return true;
  //     }
  //   }
  //   this.col = color(255,255,255);
  //   return false;
  // }


}
