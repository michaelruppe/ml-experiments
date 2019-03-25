

class Point {
  float x;
  float y;
  int label;
  
  Point() {
    x = random(width);
    y = random(height);
    
    if (y > x) {
      label =  1;
    } else {
      label = -1;
    } 
  }
  
  void show() {
    stroke(0);
    if (label == 1) {
      fill(0);
    }else{
      fill(255);
    }
    ellipse(x,y,32,32);
  }
}
