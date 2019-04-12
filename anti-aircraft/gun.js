class Gun {
  constructor() {
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

  }

  show() {
    rectMode(CENTER);
    rect(this.x, this.y, this.baseW, this.baseH);
    push(); translate(this.gunX, this.gunY); rotate(this.gunA);
    rect(0,0,this.gunW,this.gunL);
    ellipse(0,this.gunL/2,10,10)
    pop();
  }

  update() {
    // Find gun-angle from mouse position
    let r = ((mouseX-this.gunX)*(mouseX-this.gunX)) + ((mouseY-this.gunY)*(mouseY-this.gunY));
    r = Math.sqrt(r);
    let o = mouseY - this.gunY;
    let a = mouseX - this.gunX;
    this.gunA = atan2(o,a) - PI/2

  }

  shoot() {
    this.projs.push( new Projectile(createVector(this.gunX,this.gunY), this.gunA+PI/2) );
  }

  calculateScore(plane) {
    // loop through all bullets
    for( let p of projs) {
      // find minimum distance to a plane
      let r = p.distanceTo(plane);
    }

  }
}
