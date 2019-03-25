


let nn;
let lr_slider;

// The XOR data
let training_data = [
  {
    inputs: [0,0],
    outputs: [0]
  },
  {
    inputs: [0,1],
    outputs: [1]
  },
  {
    inputs: [1,0],
    outputs: [1]
  },
  {
    inputs: [1,1],
    outputs: [0]
  },
];

function setup() {
  createCanvas(400,400);
  nn = new NeuralNetwork(2,3,1); // 2 is really the minimum of hidden nodes. sometimes it gets stuck
  lr_slider = createSlider(0.01,0.3,0.05,0.01);

}



function draw() {
  background(0);
  nn.setLearningRate(lr_slider.value());

  // Train from a random element from the training data a bunch of times before
  // each frame
  for (let i = 0; i < 1000; i++){
    let data = random(training_data);
    nn.train(data.inputs,data.outputs);

  }
  let resolution = 10;
  let cols = width/resolution;
  let rows = height/resolution;
  for (let i=0; i<cols;i++) {
    for (let j=0; j<rows;j++) {
      let x1 = i/cols;
      let x2 = j/rows;
      let inputs = [x1,x2];
      let y = nn.predict(inputs);
      fill(y*255);
      noStroke();
      rect(i*resolution, j*resolution, resolution, resolution);
    }
  }
}
