// 10.2: Neural Networks: Perceptron Part 1 - The Nature of Code
// https://youtu.be/ntKn5TPHHAk

Perceptron perc;

Point[] points = new Point[100];

void setup() {
  size(800, 800);
  perc = new Perceptron();

  for (int i = 0; i < points.length; i++) {
    points[i] = new Point();
  }
  //int guess = p.guess(inputs);
}

void draw() {
  background(255);
    line(0,0,width,height);

  // Draw all the training points
  for (Point pt : points) {
    pt.show();
    
  }
 
  // show if the guesses are correct using red/green dots
  for (Point pt : points) {
    float[] inputs = {pt.x, pt.y};
    int target = pt.label;
    int guess = perc.guess(inputs);
    if (guess == target) {
      fill(0,255,0); // green
    }else{
      fill(255,0,0);
    }
    noStroke();
    ellipse(pt.x, pt.y, 8,8);
      
  }
}

// Train the perceptron each time the mosue is clicked.
void mousePressed() {
    for (Point pt : points) {
    float[] inputs = {pt.x, pt.y};
    int target = pt.label;
    perc.train(inputs, target);
    }
}
