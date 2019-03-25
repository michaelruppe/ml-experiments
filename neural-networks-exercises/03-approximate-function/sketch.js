// A garbage function approximator
// I suspect the naive error function used in nn.js is the culprit.


class Point {
  constructor(x_,y_){
    this.x = x_;
    this.y = y_;
  }
}

let training_data = [];
let numTrainingPoints = 50;
let nn;

function f(x) {
  return sin(x);
}

function conditionInput(x) {
  return map(x,0,TWO_PI,0,1);
}
function retrieveInput(x) {
  return map(x,0,1,0,TWO_PI);
}

function setup() {
  angleMode(RADIANS);
  createCanvas(800,600);
  // lr_slider = createSlider(1e-4,1e-3,1e-4);

  nn = new NeuralNetwork(1,20,1);
  nn.setActivationFunction(tanh);
  nn.setLearningRate(1e-3);


  // Populate the training data set
  for (let x = 0; x <= TWO_PI; x+= TWO_PI/numTrainingPoints) {
    let y = f(x);
    training_data.push( new Point(x,y) );
  }

}

function draw() {
  background(255);
  // nn.setLearningRate(lr_slider.value());
  // Display training data points
  for (let i = 0; i < training_data.length; i++) {
    let pointX = training_data[i].x;
    let pointY = training_data[i].y;
    let x = map(pointX,0,TWO_PI,0,width);
    let y = map(pointY,-1,1,height,0);
    fill(0);
    noStroke();
    ellipse(x,y,5,5);
  }

  // Train the neural network
  for (let i = 0; i < 50000; i++) {
    let data = random(training_data);
    let x_ = conditionInput(data.x);
    nn.train([x_],[data.y]);

  }

  for (let i = 0; i < TWO_PI; i += TWO_PI/width){
    // Display the desired function
    let y = map(f(i),-1,1,height,0);
    let x = map(i,0,TWO_PI,0,width);
    fill(0);
    ellipse(x,y,1,1);

    // Display the approximation
    let x_ = conditionInput(i);
    let y_ = nn.predict([x_]);
    let y_a = map(y_[0],-1,1,height,0);
    fill(150);
    ellipse(x,y_a,1,1);
  }

}
