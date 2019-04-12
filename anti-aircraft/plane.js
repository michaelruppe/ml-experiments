class Plane{
  constructor() {
    this.x = 0;
    this.y = random(height/2)
    this.v = 3;

    this.l = 20;
    this.w = 10;
    this.hitRadius = this.l / 2;
  }

  update(){
    this.x += this.v;

  }

  show(){
    rectMode(CENTER);
    rect(this.x,this.y,this.l,this.w);
  }

  offscreen(){
    return (this.x > width+this.l);
  }
}
