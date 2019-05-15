// Genetic algorithm functions
// TODO implement crossover

let mutationRate = 0.1;


function nextGen() {
  console.log('new gen')

  calculateFitness();


  for(let i = 0; i < POPULATION; i++){
    birds[i] = pickOne();
  }

  savedBirds = [];
}

// Normalise the scores. There are other ways to map score to fitness, like power laws or logs etc
function calculateFitness() {
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.score;
  }
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }

}

// Select bird based on fitness, copy, and mutate
// TODO: implement crossover instead of direct mutation
// Algorithm to select based on fitness is from https://youtu.be/BAejnwN4Ccw
function pickOne() {
  let index = 0;
  let r = random(1);

  while(r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;

  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  child.mutate(mut);
  return child;
}


function mut(x) {
  if (random() < mutationRate) {
    return x + x*randomGaussian(0, 0.1);
  } else {
    return x
  }
}
