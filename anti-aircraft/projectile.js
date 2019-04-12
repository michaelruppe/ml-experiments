class Projectile {
  constructor(x, angle) {
    this.x = x.copy();
    this.angle = angle;
    let speed = 10;
    this.v = createVector(speed*cos(this.angle), speed*sin(this.angle));
    this.a = createVector(0, 7e-2);
  }

  update() {
    this.v.add(this.a);
    this.x.add(this.v);
  }

  show() {
    ellipse(this.x.x,this.x.y,10,10)
  }

  // going above top of screen is allowed
  offscreen() {
    return (this.x.x < 0 || this.x.y > height || this.x.x > width)
  }

  hits(plane) {
    return (abs(this.x.x - plane.x) < plane.hitRadius && abs(this.x.y - plane.y) < plane.hitRadius)
  }


}
