// train for one epoch
function trainEpoch(training) {
  shuffle(training, true); // true overrites input array. It's important the training data is re-shuffled each training cycle
  for (let i = 0; i < training.length; i++ ) {
    // create normalised input array
    let data = training[i];
    let inputs = Array.from(data).map(x => x / 255); // map passes all elements through a function, and we define the function
    //Array() is used because data.map(x => x/255); returns only Uint8 but we want floating points
    let label = training[i].label;
    let targets = [0,0,0,0]; // create a "one-hot" output array IMPORTANT must match output array size
    targets[label] = 1;

    nn.train(inputs, targets);
  }
}

// test for one epoch
function testAll(testing) {
  let correct = 0;
  for (let i = 0; i < testing.length; i++ ) {
    // create normalised input array
    let data = testing[i];
    let inputs = Array.from(data).map(x => x / 255); // map passes all elements through a function, and we define the function
    //Array() is used because data.map(x => x/255); returns only Uint8 but we want floating points
    let label = testing[i].label;
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    // console.log(guess,classification,label);

    if (classification === label) {
      correct++;
    }
  }
  let percent = 100 * correct / testing.length;
  return(percent);
}
