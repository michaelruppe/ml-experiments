/*
  Classify whether a doodle is a cat, rainbow or train
  [784 pixels] -> NN -> [CAT, RAINBOW, TRAIN]

*/

const len = 784;
const total_data = 1000;
const train_test_ratio = 0.8; // train with 80% of all data, test with remaining

// this now defines the order of the output vector
const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;


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
let nn;


function preload() {
  cats_data = loadBytes("data/cat1000.bin");
  trains_data = loadBytes('data/locomotive1000.bin');
  rainbows_data = loadBytes('data/rainbow1000.bin');

}

// Load test and training data into an object
function prepareData(category, data, label){
  category.training = [];
  category.testing = [];

  let threshold = floor(train_test_ratio * total_data);
  for (let i = 0; i < total_data; i++){
    if (i < threshold) {
      let ofs = i * len;
      category.training[i] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
      category.training[i].label = label;
    }else {
      let ofs = i * len;
      category.testing[i - threshold] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
      category.testing[i - threshold].label = label;
    }
  }
}


function setup() {
  createCanvas(280, 280);
  background(0);

  // Prepare the data
  prepareData(cats, cats_data, CAT);
  prepareData(rainbows, rainbows_data, RAINBOW);
  prepareData(trains, trains_data, TRAIN);

  // Make the neural network
  nn = new NeuralNetwork(len, 64, 3);

  // randomise the training data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);
  shuffle(training, true); // true overrites input array

  // train for one epoch
  for (let i = 0; i < training.length; i++ ) {
    // create normalised input array
    let data = training[i];
    let inputs = [];
    for (let j = 0; j < data.length; j++) {
      inputs[j] = data[j] / 255.0;
    }
    let label = training[i].label;

    // create a "one-hot" output array
    let targets = [0,0,0];
    targets[label] = 1;

    nn.train(inputs, targets);

  }

  console.log("trained for one epoch");


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
