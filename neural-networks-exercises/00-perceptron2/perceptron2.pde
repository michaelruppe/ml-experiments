// 10.3: Neural Networks: Perceptron Part 2 - The Nature of Code
// https://youtu.be/DGxIcDjPzac

// Now generalise a bit to allow for any straight line to be guessed (not just y = x)

Perceptron perc;

Point[] points = new Point[200];

void setup() {
  size(800, 800);
  perc = new Perceptron(3);

  for (int i = 0; i < points.length; i++) {
    points[i] = new Point();
  }
  //int guess = p.guess(inputs);
}

void draw() {
  background(255);
  stroke(0);
  //  draw the true line
  Point p1 = new Point(-1, f(-1) );
  Point p2 = new Point(1, f(1) );
  line(p1.pixelX(),p1.pixelY(),p2.pixelX(),p2.pixelY());

  // draw the guessed line
  Point p3 = new Point(-1, perc.guessY(-1));
  Point p4 = new Point(1, perc.guessY(1));
  line(p3.pixelX(),p3.pixelY(),p4.pixelX(),p4.pixelY());

  // Draw all the training points
  for (Point pt : points) {
    pt.show();
    
  }
 
  // show if the guesses are correct using red/green dots
  for (Point pt : points) {
    float[] inputs = {pt.x, pt.y, pt.bias};
    int target = pt.label;
    int guess = perc.guess(inputs);
    if (guess == target) {
      fill(0,255,0); // green
    }else{
      fill(255,0,0); // red
    }
    perc.train(inputs, target); // Train ALWAYS

    noStroke();
    ellipse(pt.pixelX(), pt.pixelY(), 16,16);
      
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
