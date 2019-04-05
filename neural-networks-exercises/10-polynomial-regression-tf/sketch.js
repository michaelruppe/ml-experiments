// Perform polynomial regression on points dropped by user with mouse clicks

// TODO: vector of coefficients a0, a1, a2 etc. at the moment each coeff is managed manually = yuck

// arrays for data points
let x_vals = [];
let y_vals = [];

let m, b, a, c;

// Set parameters
const learningRate = 0.4;
const optimizer = tf.train.adam(learningRate);

function setup() {
  createCanvas(400,400);
  background(0);

  // initialising the parameters to approximate, make sure the values are updateable
  m = tf.variable( tf.scalar(random(1)) );
  b = tf.variable( tf.scalar(random(1)) );
  a = tf.variable( tf.scalar(random(1)) );
  c = tf.variable( tf.scalar(random(1)) );


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
    let px = map(x_vals[i], -1, 1, 0, width);
    let py = map(y_vals[i], -1, 1, height, 0);
    point(px,py);
  }

    if( x_vals.length > 0) {
      // const lineX = [-1, 1];
      const xs = tf.linspace(-1, 1, 100);
      let lineX = xs.dataSync();
      const ys = tf.tidy(() => predict(lineX) ); // Tidy as we go. predict returns something so we can clear it immediately
      let lineY = ys.dataSync();
      ys.dispose();
      xs.dispose();

      // Draw the estimated curve
      strokeWeight(2);
      beginShape();
      noFill();
      for (let i = 0; i < lineX.length; i++) {
        let px = map(lineX[i], -1, 1, 0, width);
        let py = map(lineY[i], -1, 1, height, 0)
        vertex(px,py);
      }
      endShape();

    }
}

// Add the clicked point to our data points
function mousePressed() {
  x_vals.push( map(mouseX, 0, width, -1, 1) );
  y_vals.push( map(mouseY, 0, height, 1, -1) );
}

// in ES6
// const loss = (pred, label) => pred.sub(label).square().mean();
function loss(pred, label) {
  return pred.sub(label).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);

  // y = ax^2 + bx + c
  const ys = xs.square().mul(a).add(
    xs.mul(b).add(c)
  );
  return ys;
}
