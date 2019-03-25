// A library for a 2 layer neural network
// from the Session 4 - Neural Networks playlist on Coding Train
// https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb

function sigmoid(x) {
  return (1 / (1 + Math.exp(-x)) );
}

function dsigmoid(y) {
  //return sigmoid(x) * 1 - sigmoid(x);
  // the outputs have already passed through the sigmoid function so this is a
  // a kind of fake dsigmoid function.
  return y * (1 - y);
}

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);

    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes,1);
    this.bias_o = new Matrix(this.output_nodes,1);
    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_rate = 0.05;

  }
  // NOTE: in the nn.js library this is called predict()
  feedforward(input_array) {

    // Generating the hidden outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // Activation function
    hidden.map(sigmoid);

    // Generating the output's outputs
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    // Activation function
    output.map(sigmoid);

    // Send back to the caller as array
    return output.toArray();
  }

  train(input_array, target_array) {
    // All copied from feedforward function - some redundancy in code
        // Generating the hidden outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // Activation function
        hidden.map(sigmoid);

        // Generating the output's outputs
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        // Activation function
        outputs.map(sigmoid);


    // Convert arrays to matrix objects
    let targets = Matrix.fromArray(target_array);

    // ADJUST OUTPUT WEIGHTS ***************************************************
    // Calculate output error
    let output_errors = Matrix.subtract(targets, outputs);

    // Gradient descent video 10.16 backpropagation 3
    //let gradient = outputs * (1 - outputs);
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate hidden->output deltas and adjust the weights
    let hidden_T = Matrix.transpose(hidden);
    let delta_weight_ho = Matrix.multiply(gradients, hidden_T);
    this.weights_ho.add(delta_weight_ho);
    this.bias_o.add(gradients); // the bias is adjusted by just the gradient: video 10.18 Backpropagation 5
    // ADJUST HIDDEN WEIGHTS ***************************************************
    // Calculate hidden error
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calculate input->hidden deltas and adjust weights
    let inputs_T = Matrix.transpose(inputs);
    let delta_weight_ih = Matrix.multiply(hidden_gradient, inputs_T);
    this.weights_ih.add(delta_weight_ih);
    this.bias_h.add(hidden_gradient); // the bias is adjusted by just the gradient: video 10.18 Backpropagation 5

    // outputs.print();
    // targets.print();
    // error.print();
  }



}
