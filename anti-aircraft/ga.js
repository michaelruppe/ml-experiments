// Genetic algorithm functions
// TODO implement crossover

let mutationRate = 0.1;


function nextGen() {
  console.log('new gen')

  // Calculate fitness of all guns, and return best one
  calculateFitness();


  for(let i = 0; i < POPULATION; i++){
    guns[i] = pickOne();
  }

  savedGuns = [];
}

// Normalise the scores. There are other ways to map score to fitness, like power laws or logs etc
function calculateFitness() {
  let sum = 0;
  let bestFitness = 0;
  let bestPerformer;

  for (let gun of savedGuns) {
    sum += gun.score;
  }
  for (let gun of savedGuns) {
    gun.fitness = gun.score / sum;
    if (gun.fitness > bestGun.fitness){
      bestGun = gun.fitness;
    }
  }
}

// Select bird based on fitness, copy, and mutate
// TODO: implement crossover instead of direct mutation
// Algorithm to select based on fitness is from https://youtu.be/BAejnwN4Ccw
function pickOne() {
  let index = 0;
  let r = random(1);

  while(r > 0) {
    r = r - savedGuns[index].fitness;
    index++;
  }
  index--;

  let gun = savedGuns[index];
  let child = new Gun(gun.brain);
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
