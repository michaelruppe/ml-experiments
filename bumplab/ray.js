class Ray {
  constructor(pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }

  lookAt(x,y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
    stroke(255, 100);
    push();
    translate(this.pos.x, this.pos.y);
    pop();
  }

  // Find a point of intersection. (line-line intersection algorithm, wikipedia: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection)
  // Could use p5.collide2D: https://github.com/bmoren/p5.collide2D
  cast(wall) {
    // Being very explicit to match the wikipedia formula
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
    if (den == 0) { // lines are parallel
      return;
    }

    const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / den;
    const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / den;

    // Check point of intersection exists
    if (0 < t && t < 1){ // Within boundary line segment
      if (u > 0) { // On front end of ray
        const pt = createVector();
        pt.x = x1 + t * (x2-x1);
        pt.y = y1 + t * (y2-y1);
        return pt;
      }
    }
    return;
  }
}
