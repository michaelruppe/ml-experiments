class Plane{
  constructor() {
    this.x = 0;
    this.y = random(20, height/2)
    this.v = random(2,4);

    this.l = 20;
    this.w = 10;
    this.hitRadius = this.l / 2;
  }

  update(){
    this.x += this.v;

  }

  show(){
    imageMode(CENTER);
    image(spriteUFO, this.x, this.y)

    // The old animation
    // stroke(0); strokeWeight(1); fill(255);
    // rectMode(CENTER);
    // rect(this.x,this.y,this.l,this.w);
  }

  offscreen(){
    return (this.x > width+this.l);
  }
}
