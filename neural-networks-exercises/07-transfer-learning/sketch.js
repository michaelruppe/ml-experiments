// transfer learning to train the network to recognise new objects
// https://youtu.be/eeO-rWYFuG0

// It seems like some things have been updated. we're now using
// object.classify() instead of object.predict()

let mobilenet;
let classifier
let video;
let label = '';
let handButton;
let footButton;
let trainButton;
let blankButton;


function modelReady() {
  console.log('Model is ready');

}

function videoReady() {
  console.log('Video is ready');

}

// ml5 works with error first callbacks
function gotResults(error, results) {
  if (error) {
  } else {
    label = results;
    let prob = results[0].probability;
    // console.log(label);
    classifier.classify(gotResults);

  }
}

function whileTraining(loss) {
  if (loss == null) {
    console.log("training complete");
    classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO).hide();
  background(0);

  // NOTE mobilenet is now a feature extractor
  mobilenet = ml5.featureExtractor('MobileNet',  modelReady);
  classifier = mobilenet.classification(video, videoReady);

  let handButton = createButton('capture neutral expression');
  handButton.mousePressed( ()=> {
    classifier.addImage('neutral');
    console.log('Sampled');
  })

  let footButton = createButton('capture happy expression');
  footButton.mousePressed( ()=> {
    classifier.addImage('happy');
    console.log('Sampled');
  })

  let controlButton = createButton('capture angry expression');
  controlButton.mousePressed( ()=> {
    classifier.addImage('angry');
    console.log('Sampled');
  })

  let trainButton = createButton('train');
  trainButton.mousePressed( ()=> {
    classifier.train(whileTraining);
  })

}

function draw() {
  background(0);
  // put drawing code here
  image(video,0,0,width,height-40);
  fill(255);
  textSize(20);
  text(label, 10, height-10);
}
