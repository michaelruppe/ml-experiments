// Perform polynomial regression on points dropped by user with mouse clicks
// a natural upgrade from the previous exercise
// TODO: vector of coefficients a0, a1, a2 etc. at the moment each coeff is managed manually = yuck

// arrays for data points
let x_vals = [];
let y_vals = [];

let a, b, c, d;

let dragging = false;

// Set parameters
const learningRate = 0.4;
const optimizer = tf.train.adam(learningRate);

function setup() {
  createCanvas(800,800);
  background(0);

  // initialising the parameters to approximate, make sure the values are updateable
  a = tf.variable( tf.scalar(random(1)) );
  b = tf.variable( tf.scalar(random(1)) );
  c = tf.variable( tf.scalar(random(1)) );
  d = tf.variable( tf.scalar(random(1)) );


}

function draw() {
  if(dragging) {
    x_vals.push( map(mouseX, 0, width, -1, 1) );
    y_vals.push( map(mouseY, 0, height, 1, -1) );
  } else {
    // can't do these when no data!
    if (x_vals.length > 0) {
      tf.tidy(() => {
        const ys = tf.tensor1d(y_vals);

        // minimizes output. optional 3rd argument var list sets which variables are trainable. since none provided, assumes all trainable
        // it is optional to train only selected coefficients
        optimizer.minimize(() => loss(predict(x_vals), ys));
      });

    }
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

// Flag mouse activity
function mousePressed() {
  dragging = true;
}
function mouseReleased() {
  dragging = false;
}

// in ES6
// const loss = (pred, label) => pred.sub(label).square().mean();
function loss(pred, label) {
  return pred.sub(label).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);

  // y = ax^3 + bx^2 + cx + d
  const ys = xs.pow(3).mul(a).add(
    xs.square().mul(b).add(
      xs.mul(c).add(d)
    )
  );
  return ys;
}
