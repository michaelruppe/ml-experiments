/*******************************************************************************
 * Raycasting

 ******************************************************************************/

let walls = [];
let particle;

function setup() {

  let canvas = createCanvas(600,500);
  canvas.parent('sketch-holder');
  walls.push( new Boundary(random(width),random(height),random(width),random(height)) );
  walls.push( new Boundary(random(width),random(height),random(width),random(height)) );
  walls.push( new Boundary(random(width),random(height),random(width),random(height)) );
  walls.push( new Boundary(random(width),random(height),random(width),random(height)) );

  walls.push(new Boundary(0,0,width,0));
  walls.push(new Boundary(0,0,0,height));
  walls.push(new Boundary(width-1,0,width-1,height));
  walls.push(new Boundary(0,height-1,width,height-1));

  particle = new Particle();

}


function draw() {
  background(color('#772952')); // Aubergine

  for (let wall of walls) {
    wall.show();
  }

  particle.update(mouseX, mouseY);
  particle.show();
  particle.look(walls);

}
