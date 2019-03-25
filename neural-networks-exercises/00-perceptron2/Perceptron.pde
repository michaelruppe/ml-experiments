int sign(float n) {
  if (n >= 0) return 1;
  else return -1;
}

class Perceptron {
  float[] weights;
  float learning_rate = 0.001;

  // Constructor - Initialise with random weights
  Perceptron(int n) {
    weights = new float[n];
    for (int i = 0; i < weights.length; i++) {
      weights[i] = random(-1, 1);
    }
  }

  int guess(float[] inputs) {
    float sum = 0;
    for (int i = 0; i < weights.length; i++) {
      sum += inputs[i] * weights[i];
    }
    int output = sign(sum);
    return output;
  }
  
  float guessY(float x) {
    float w0 = weights[0];
    float w1 = weights[1];
    float w2 = weights[2];
    return -(w2/w1) - (w0/w1)*x;  //(w2/w1)*bias but bias = 1
  }
  
  
  void train(float[] inputs, int target) {
    int guess = guess(inputs); 
    int error = target - guess;

    // Tune all the weights
    for (int i = 0; i < weights.length; i++) {
      weights[i] += error * inputs[i] * learning_rate;
    }
  }
}
