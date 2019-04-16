class Projectile {
  constructor(x, angle, parent = true) {
    this.x = x.copy();
    this.angle = angle;
    let speed = 10;
    this.parent = parent;
    this.v = createVector(speed*cos(this.angle), speed*sin(this.angle));
    this.a = createVector(0, 7e-2);
    this.minDistance = Infinity; // minimum distance-to-target
    this.path = [];

    if(parent) {
      this.tracer = new Projectile(this.x.copy(), this.angle, false); // beware recursion!;
    }
  }

  update() {
    this.v.add(this.a);
    this.x.add(this.v);
  }

  show() {
      // show the real projectile
      fill(0); noStroke();
      ellipse(this.x.x,this.x.y,10,10)

    if(this.parent && showTrails) {
      // create a 'virtual' projectile. This will not interact with planes
      if(this.path.length == 0) {
      // simulate the projectile forward in time and store path
        while(!this.tracer.offscreen()){
          this.tracer.update();
          this.path.push(this.tracer.x.copy());
        }
      }

      stroke(0,100); strokeWeight(1);
      beginShape(LINES);
      for(let p of this.path) {
        vertex(p.x,p.y)

      }
      endShape();
    }
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
