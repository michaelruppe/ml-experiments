// Perform linear regression on points dropped by user with mouse clicks
// https://youtu.be/dLp10CFIvxI

// TODO: include some ES6
// memory management more elegant
// repeat example for a quadratic

// arrays for data points
let x_vals = [];
let y_vals = [];

let m, b;

// Set parameters
const learningRate = 0.4;
const optimizer = tf.train.sgd(learningRate);

function setup() {
  createCanvas(400,400);
  background(0);

  // initialising the parameters to approximate, make sure the values are updateable
  m = tf.variable( tf.scalar(random(1)) );
  b = tf.variable( tf.scalar(random(1)) );


}

function draw() {

  // can't do these when no data!
  if (x_vals.length > 0) {
    tf.tidy(() => {
      const ys = tf.tensor1d(y_vals);

      // minimizes output. optional 3rd argument var list sets which variables are trainable. since none provided, assumes all trainable
      // to train only m or only b you have to specify
      optimizer.minimize(() => loss(predict(x_vals), ys));
    });
  }


  background(0);
  stroke(255);
  strokeWeight(4);
  for(let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], 0, 1, 0, width);
    let py = map(y_vals[i], 0, 1, height, 0);
    point(px,py);
  }

    if( x_vals.length > 0) {
      const lineX = [0, 1];
      const ys = tf.tidy(() => predict(lineX) ); // Tidy as we go. predict returns something so we can clear it immediately
      let lineY = ys.dataSync();
      ys.dispose();

      let x1 = map(lineX[0], 0, 1, 0, width);
      let x2 = map(lineX[1], 0, 1, 0, width);
      let y1 = map(lineY[0], 0, 1, height, 0);
      let y2 = map(lineY[1], 0, 1, height, 0);
      strokeWeight(2);
      line(x1, y1, x2, y2);

    }
}

// Add the clicked point to our data points
function mousePressed() {
  x_vals.push( map(mouseX, 0, width, 0, 1) );
  y_vals.push( map(mouseY, 0, height, 1, 0) );
}

// in ES6
// const loss = (pred, label) => pred.sub(label).square().mean();
function loss(pred, label) {
  return pred.sub(label).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);

  // y = mx + b
  const ys = xs.mul(m).add(b);
  return ys;
}
