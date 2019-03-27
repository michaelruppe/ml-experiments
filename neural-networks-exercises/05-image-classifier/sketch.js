// Image classification with mobilenet. Essentially re-creating the
// examples from ml5 website
// https://youtu.be/yNkAuWz5lnY

let mobilenet;
let puffin;
function modelReady() {
  console.log('Model is ready');
  mobilenet.predict(puffin, gotResults);
}

function imageReady() {
  image(puffin, 0, 0, width, height);
}

// ml5 works with error first callbacks
function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    let label = results[0].className;
    let prob = results[0].probability;
    console.log(label);
    fill(0);
    textSize(64);
    text(label,10, height-50);
    createP(label);
    createP('with probability ' + 100*prob + ' %');
  }
}


function setup() {
  createCanvas(640, 480);
  puffin = createImg('images/blue-footed-booby.jpg', imageReady).hide();
  background(0);

  mobilenet = ml5.imageClassifier('MobileNet', modelReady);


}

function draw() {
  // put drawing code here
}
