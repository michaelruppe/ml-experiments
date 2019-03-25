class Point {
  constructor(x_,y_){
    this.x = x_;
    this.y = y_;
  }
}

let training_data = [];
let numTrainingPoints = 100;
let nn;

function f(x) {
  return sin(x);
}

function setup() {
  // noLoop();
  angleMode(RADIANS);
  createCanvas(800,600);
  lr_slider = createSlider(0.0001,0.01,0.0005,0.0005);

  nn = new NeuralNetwork(1,10,1);
  nn.setActivationFunction(tanh);
  // Populate the training data set
  for (let x = 0; x < TWO_PI; x+= TWO_PI/numTrainingPoints) {
    let y = f(x);
    training_data.push( new Point(x,y) );
  }

}

function draw() {
  background(0);
  nn.setLearningRate(lr_slider.value());

  // Display training data points
  for (let i = 0; i < training_data.length; i++) {
    let pointX = training_data[i].x;
    let pointY = training_data[i].y;
    let x = map(pointX,0,TWO_PI,0,width);
    let y = map(pointY,-1,1,height,0);
    fill(255);
    noStroke();
    ellipse(x,y,5,5);
  }

  // Train the neural network
  for (let i = 0; i < 1000; i++) {
    let data = random(training_data);
    nn.train([data.x],[data.y]);

  }

  for (let i = 0; i < TWO_PI; i += TWO_PI/width){
    // Display the approximated function
    let y = map(f(i),-1,1,height,0);
    let x = map(i,0,TWO_PI,0,width);
    ellipse(x,y,1,1);

    // Display the approximation
    let y_ = nn.predict([i]);
    y = map(y_[0],-1,1,height,0);
    ellipse(x,y,1,1);
  }

  let y_ = [];
  y_[0] = nn.predict([TWO_PI]);
  console.log(TWO_PI,y_[0]);


}
