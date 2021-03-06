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
// const CAT = 0;
// const RAINBOW = 1;
// const TRAIN = 2;
// const COW = 3;

const CAT = 0;
const GUITAR = 1;
const HOUSE = 2;
const FISH = 3;

let resultText;
let guessText = "empty";

const classificationSpace = [CAT, GUITAR, HOUSE, FISH];

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
let guitars = {};
let houses = {};
let fishs = {};
let nn;


function preload() {
  cats_data = loadBytes("data/cat1000.bin");
  trains_data = loadBytes('data/locomotive1000.bin');
  rainbows_data = loadBytes('data/rainbow1000.bin');
  guitars_data = loadBytes('data/guitar1000.bin');
  houses_data = loadBytes('data/house1000.bin');
  fishs_data = loadBytes('data/fish1000.bin');

}

function setup() {
  let canvas = createCanvas(280, 280);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  background(255);

  // Display the guess for the user: create the paragraph element
  // createP('This looks like: ' + guessText).addClass('text').hide();
  resultText = createP('This looks like a: <b>' + guessText + '</b>');
  resultText.parent('result-holder');

  // Prepare the data
  prepareData(cats, cats_data, CAT);
  // prepareData(rainbows, rainbows_data, RAINBOW);
  // prepareData(trains, trains_data, TRAIN);
  prepareData(guitars, guitars_data, GUITAR);
  prepareData(houses, houses_data, HOUSE);
  prepareData(fishs, fishs_data, FISH);

  // Make the neural network
  nn = new NeuralNetwork(len, 16, 4);

  // collect the training and testing data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(guitars.training);
  training = training.concat(houses.training);
  training = training.concat(fishs.training);
  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(guitars.testing);
  testing = testing.concat(houses.testing);
  testing = testing.concat(fishs.testing);

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

    // if (classification === CAT) {
    //   console.log("cat");
    // } else if (classification === RAINBOW) {
    //   console.log("rainbow");
    // } else if (classification === TRAIN) {
    //   console.log("train");
    // }
    if (classification === CAT) {
      console.log("cat");
      guessText = "cat";
    } else if (classification === GUITAR) {
      console.log("guitar");
      guessText = "guitar";
    } else if (classification === HOUSE) {
      console.log("house");
      guessText = "house";
    } else if (classification === FISH) {
      console.log("fish");
      guessText = "fish";
    }
  });

  let clearButton = select('#erase');
  clearButton.mousePressed( () => {
    background(255);
    guessText = "empty";
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
  strokeWeight(10);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY,mouseX, mouseY);
  }
  resultText.html('This looks like a: <b>' + guessText + '</b>');
}
