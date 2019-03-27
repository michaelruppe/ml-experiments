// Webcam image classification with mobilenet. Essentially re-creating the
// examples from ml5 website
// https://youtu.be/D9BoBSkLvFo

let mobilenet;
let video;
let label = '';

function modelReady() {
  console.log('Model is ready');
  mobilenet.predict(gotResults);

}

// ml5 works with error first callbacks
function gotResults(error, results) {
  if (error) {
  } else {
    label = results[0].className;
    let prob = results[0].probability;
    console.log(label);
    mobilenet.predict(gotResults);

  }
}


function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO).hide();
  background(0);

  // Set up mobilenet to work continuously with the video
  // recall the previous example was:   mobilenet = ml5.imageClassifier('MobileNet', modelReady);
  mobilenet = ml5.imageClassifier('MobileNet', video, modelReady);

}

function draw() {
  background(0);
  // put drawing code here
  image(video,0,0,width,height-40);
  fill(255);
  textSize(20);
  text(label, 10, height-10);
}
