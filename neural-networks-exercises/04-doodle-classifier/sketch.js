const len = 784;
const total_data = 1000;
const train_test_ratio = 0.8; // train with 80% of all data, test with remaining

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

function preload() {
  cats_data = loadBytes("data/cat1000.bin");
  trains_data = loadBytes('data/locomotive1000.bin');
  rainbows_data = loadBytes('data/rainbow1000.bin');

}

// Load test and training data into an object
function prepareData(category, data){
  category.training = [];
  category.testing = [];

  let threshold = floor(train_test_ratio * total_data);
  for (let i = 0; i < total_data; i++){
    if (i < threshold) {
      let ofs = i * len;
      category.training[i] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
    }else {
      let ofs = i * len;
      category.testing[i - threshold] = data.bytes.subarray(ofs, ofs + len); // grab one image worth of data from the raw data array
    }
  }
}


function setup() {
  createCanvas(280, 280);
  background(0);

  prepareData(cats, cats_data);
  prepareData(rainbows, rainbows_data);
  prepareData(trains, trains_data);

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
