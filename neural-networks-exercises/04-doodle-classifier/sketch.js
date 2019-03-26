/*
  Classify whether a doodle is a cat, rainbow or train
  [784 pixels] -> NN -> [CAT, RAINBOW, TRAIN]


  "Machine learning! It's a thing that sometimes, kind of almost maybe sort of
   works, but is highly problematic for many important ethical and
   social reasons." - Dan Shiffman
*/

const NUM_TRAINING_CYCLES = 1;


const len = 784;
const total_data = 1000;

// this now defines the order of the output vector
const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;
const COW = 3;

let cats_data;
let trains_data;
let rainbows_data;

let cats_training;
let trains_training;
let rainbows_training;

// Instantiate objects
let cats = {};
let trains = {};
let rainbows = {};
let cows = {};
let nn;


function preload() {
  cats_data = loadBytes("data/cat1000.bin");
  trains_data = loadBytes('data/locomotive1000.bin');
  rainbows_data = loadBytes('data/rainbow1000.bin');
  // cows_data = loadBytes('data/cow1000.bin');

}

function setup() {
  createCanvas(280, 280);
  background(255);

  // Prepare the data
  prepareData(cats, cats_data, CAT);
  prepareData(rainbows, rainbows_data, RAINBOW);
  prepareData(trains, trains_data, TRAIN);

  // Make the neural network
  nn = new NeuralNetwork(len, 32, 3);

  // collect the training and testing data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);
  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(rainbows.testing);
  testing = testing.concat(trains.testing);

  let epochCounter = 0;
  let trainButton = select('#train');
  trainButton.mousePressed( () => {
    trainEpoch(training);
    epochCounter++;
    let percent = testAll(testing);
    console.log("Epoch: " + epochCounter + "  Percent Correct: " + nf(percent,2,2) + "%");
  });

  let testButton = select('#test');
  testButton.mousePressed( () => {
    let percent = testAll(testing);
    console.log("Percent Correct: ", nf(percent,2,2), "%");
  });

  // Sample the canvas space for the user's drawing and create a 28*28 sample
  let guessButton = select('#guess');
  guessButton.mousePressed( () => {
    let inputs = [];
    let img = get(); // grab all pixels from the canvas
    img.resize(28,28);
    img.loadPixels();
    for (let i = 0; i < len; i++) {
      let brightness = img.pixels[i*4];
      inputs[i] = (255 - brightness) / 255.0;
    }

    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    if (classification === CAT) {
      console.log("cat");
    } else if (classification === RAINBOW) {
      console.log("rainbow");
    } else if (classification === TRAIN) {
      console.log("train");
    }
  });

  let clearButton = select('#erase');
  clearButton.mousePressed( () => {
    background(255);
  });

  // Obsolete: read data from file into an array then this code displays the image
  // Visualise the images to make sure we're reading them correctly ------------
  // let total = 100;
  // // for all the images
  // for (let n = 0; n < total; n++) {
  //   let img = createImage(28, 28);
  //   img.loadPixels();
  //   let ofs = n * len; // offset by image number
  //   for (let i = 0; i < 784; i++) {
  //     let val = 255 - cats_data.bytes[i + ofs]; // 255- inverts b/w
  //     img.pixels[i*4 + 0] = val;
  //     img.pixels[i*4 + 1] = val;
  //     img.pixels[i*4 + 2] = val;
  //     img.pixels[i*4 + 3] = 255; // 4th byte is Alpha value
  //   }
  //   img.updatePixels();
  //   let x = (n % 10) * 28;
  //   let y = floor(n / 10) * 28;
  //   image(img, x, y);
  // }
  // ---------------------------------------------------------------------------

}



function draw() {
  // background(255);
  strokeWeight(6);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY,mouseX, mouseY);
  }
}
