// Following along with https://youtu.be/KtPpoMThKUs

let r,g,b;
let brain;

let which = "black"

function pickColour() {
  r = random(255);
  g = random(255);
  b = random(255);

  which = colourPredictor(r,g,b);

  redraw();
}


function setup() {
  noLoop();
  createCanvas(600,300);
  brain = new NeuralNetwork(3, 3, 2);
  r = random(255);
  g = random(255);
  b = random(255);


  // Hot-start the training process with a hard-coded selection algorithm, trainColour()
  // This saves us having to think about starting weights too much, but trains for the
  // aesthetics described in trainColour()

  for (let i = 0; i<1000; i++){
    let r = random(255);
    let g = random(255);
    let b = random(255);

    let targets = trainColour(r,g,b);
    let inputs = [r/255, g/255, b/255];
    brain.train(inputs, targets);
  }
  console.log("Hot-start training complete");
}


function mousePressed() {
  let targets = [];
  // Does the user think black or white looks better?
  if (mouseX > width/2) {
    targets = [0, 1]; // The output corresponding to WHITE
  // } else if (mouseX < width/2){
  } else {
    targets = [1, 0]; // The output corresponding to BLACK
  }

  let inputs = [r/255, g/255, b/255]; // normalize inputs
  // console.log("inputs",inputs);
  // console.log("targets",targets);
  brain.train(inputs, targets);

  pickColour();
}

function colourPredictor(r,g,b) {
  let inputs = [r/255, g/255, b/255]; // normalize
  let outputs = brain.predict(inputs);
  console.log("outputs",outputs);

  if (outputs[0] > outputs[1]) {
    return "black";
  } else {
    return "white";
  }
}


function trainColour(r,g,b){
  if (r + g + b > 3*255/2) {
    return [1, 0];
  } else {
    return [0, 1];
  }

}

function draw() {
  background(r,g,b);
  strokeWeight(4);
  stroke(255);
  line(width/2,0,width/2,height);
  textSize(64);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text("black", width/4, height/2);
  fill(255);
  text("white", 3*width/4, height/2);

  if (which === "black"){
    fill(0);
    ellipse(width/4,300,60,60);
  } else {
    fill(255);
    ellipse(3*width/4,300,60,60);
  }

}
