// our general line function to be classified around
float f(float x) {
  // y = mx + b
  return 0.3 * x + 0.2;
}

class Point {
  float x;
  float y;
  float bias = 1;
  int label;
  
  // Initialise randomly unless otherwise initialised
  // this is called "constructor overloading"
  Point(float x_, float y_) {
    x = x_;
    y = y_;
  }
  
  Point() {
    x = random(-1, 1);
    y = random(-1, 1);

    // updated labelling to determine if point is above or below our general line
    if (y > f(x)) {
      label =  1;
    } else {
      label = -1;
    }
  }

  float pixelX() {
    return map(x, -1, 1, 0, width); // now spread the points
  }
  float pixelY() {
    return map(y, -1, 1, height, 0);
  }

  void show() {
    stroke(0);
    if (label == 1) {
      fill(0);
    } else {
      fill(255);
    }
    float px = pixelX();
    float py = pixelY();
      ellipse(px, py, 32, 32);
  }
}
