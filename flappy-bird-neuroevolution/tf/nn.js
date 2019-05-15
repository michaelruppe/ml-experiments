// Wrapper for tensorflow.js
// Terrible for what tensorflow is actually used for.
// But that's Neuroevolution for you


// Michael Ruppe
// April 2019

class NeuralNetwork {
  constructor(a, b, c, d){
    if(a instanceof tf.Sequential){
      this.model = a;
      this.inputNum = b;
      this.hiddenNum = c;
      this.outputNum = d;
    } else {
      this.inputNum = a;
      this.hiddenNum = b;
      this.outputNum = c;
      this.model = this.createModel();
    }
  }

  predict(inputs) {
    return tf.tidy(() => {
      // Need to pack the array into a tensor
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);

      const outputs = ys.dataSync();
      return outputs;
    });
  }

  createModel() {
    const model = tf.sequential();

    const hidden = tf.layers.dense({
      inputShape: [this.inputNum],
      units: this.hiddenNum,
      activation: 'sigmoid',
    });
    model.add(hidden);

    const output = tf.layers.dense({
      units: this.outputNum,
      activation: 'softmax',
    });
    model.add(output);

    return model;
  }

  copy() {
    return tf.tidy(() => {

      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];
      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }

      modelCopy.setWeights(weightCopies);
      return new NeuralNetwork(
        modelCopy,
        this.inputNum,
        this.hiddenNum,
        this.outputNum
      );

    });
  }

  mutate(rate) {
    tf.tidy(() => {
      // weights could be the tensor of weights between input-hidden or hidden-output, or indeed the biases
      const weights = this.model.getWeights();
      const mutatedWeights = [];
      for(let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice(); //dataSync doesn't copy the values. you would edit them in-place without .slice()

        for (let j = 0; j < values.length; j++){
          if (random(1) < rate){
            let w = values[j]
            values[j] = w + randomGaussian();
          }
        }
        // make a new tensor
        let newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      this.model.setWeights(mutatedWeights);

    })
  }

  dispose() {
    this.model.dispose();
  }
}
