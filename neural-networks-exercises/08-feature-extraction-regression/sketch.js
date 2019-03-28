// track an object across the screen and assign a value like a slider
// https://youtu.be/aKgq0m1YjvQ

// NOTE: classifier is replaced with a mobilenet.regression


let mobilenet;
let predictor;
let video;
let value = 0;
let slider;
let trainButton;
let addButton;

function modelReady() {
  console.log('Model is ready');

}

function videoReady() {
  console.log('Video is ready');

}

// ml5 works with error first callbacks
function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    value = results;
    predictor.predict(gotResults);

  }
}

function whileTraining(loss) {
  if (loss == null) {
    console.log("training complete");
    predictor.predict(gotResults);
  } else {
    console.log(loss);
  }
}

function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO).hide();
  background(0);


  mobilenet = ml5.featureExtractor('MobileNet',  modelReady);
  predictor = mobilenet.regression(video, videoReady);

  // Create slider and event for when the input changes
  slider = createSlider(0, 1, 0.5, 0.01);

  let addButton = createButton('add example image');
  addButton.mousePressed( ()=> {
    predictor.addImage(slider.value());
  })

  let trainButton = createButton('train');
  trainButton.mousePressed( ()=> {
    predictor.train(whileTraining);
  })

}

function draw() {
  background(0);
  // put drawing code here
  image(video,0,0,width,height-40);
  let x = map(value, 0, 1, 0, width);
  stroke(0); fill(255); strokeWeight(5);
  ellipse(x, 0.75*height, 16, 16);
  // fill(255);
  // textSize(20);
  // text(value, 10, height-10);
}
