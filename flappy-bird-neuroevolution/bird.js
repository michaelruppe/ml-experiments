class Bird {
  constructor() {
    this.y = height/2;
    this.x = 64;
    this.vel = 0;             // vertical velocity
    this.r = 12;        // edge length
    this.gravity = 0.6; // gravity
    this.lift = -15;    // lift force
  }

  show() {
    rectMode(RADIUS);
    fill(255);
    rect(this.x, this.y, this.r, this.r);
  }

  update() {
    this.vel += this.gravity;
    this.vel *= 0.95; // air resistance
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
}
