class Projectile {
  constructor(x, angle) {
    this.x = x.copy();
    this.angle = angle;
    let speed = 10;
    this.v = createVector(speed*cos(this.angle), speed*sin(this.angle));
    this.a = createVector(0, 7e-2);
    this.minDistance = Infinity; // minimum distance-to-target
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

  // return the distance of projectile to a plane
  distanceTo(plane){
      let r = p5.Vector.sub(this.x, createVector(plane.x, plane.y) );
      return r.mag();
  }

  // Returns true if a direct hit is scored
  hits(plane) {
    return (this.distanceTo(plane) < plane.hitRadius)
  }

}
