/* From: https://youtu.be/F4WWukTWoXY

Template for the steps for creating a multilayer, dense neural network


NOTE
*** Important functions
  tf.sequential() any model where the outputs of one layer feed the inputs to the next
  tf.model() is more general

  tf.dense() is a fully-connected layer
  .add() add layers to the neural net
  .compile() actually connects all the layers. Adding is not enough

*/

// Construct the layers
const model = tf.sequential();

// create hidden layer. dense is fully connected
const hidden = tf.layers.dense({
  units: 4,                // number of nodes
  inputShape: [2],          // must specify input shape of first layer
  activation: 'sigmoid'
});
// create output layer. here number of nodes is number of outputs
const output = tf.layers.dense({
  units: 1,               // number of nodes
  // here the input shape is 'inferred' from the previous layer
  activation: 'sigmoid'
});

model.add(hidden); // add the layers to the model
model.add(output);

// an optimizer using gradient descent with learning rate
const sgdOpt = tf.train.sgd(0.1);
// done configuring the model, so compile it
model.compile({
  optimizer: sgdOpt,
  loss: 'meanSquaredError',
});

// training data
const xs = tf.tensor2d([
  [0, 0],
  [0.5, 0.5],
  [1, 1],
]);

const ys = tf.tensor2d([
  [0],
  [0.5],
  [1],
]);

// fit() is async, so we need to block and wait before allowing the loop to continue calling it
// can only use await in an asynchronous function, so create one and call it.
async function train() {
  for (let i = 0; i < 1000; i++) {

    const config = {
      shuffle: true,
      epochs: 10
    }
    const response = await model.fit(xs, ys, config);
    console.log(response.history.loss[0]);

  }
}


train().then(() => {
  console.log('training complete');
  let outputs = model.predict(xs);
  outputs.print();
});
