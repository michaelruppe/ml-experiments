// Preprocessing the image data for later use in a p5.js script
// this will select a smaller dataset from the larger set

byte[] data = loadBytes("data/house.npy");
int imgDim = 28;                // length of image side in pixels
int imgRes = imgDim * imgDim;   // number of pixels in an image
size(280, 280);                 // 10x10 grid of images


//The total number of images
//int total = (data.length - start) / numImagePixel;
//println(total);
int total = 1000;  // how many images to consider

byte[] outdata = new byte[total*imgRes];
int outIndex = 0;


for (int n = 0; n < total; n++) {
  int start = 80 + n * imgRes;
  PImage img = createImage(28, 28, RGB);
  img.loadPixels();
  for (int i = 0; i < imgRes; i++) {

    int index = i + start;
    byte val = data[index];
    outdata[outIndex++] = val;
    img.pixels[i] = color(255 - val & 0xFF); // Bitwise against white
  }
  img.updatePixels();
  int x = imgDim * (n % 10);
  int y = imgDim * (n / 10);
  image(img, x, y);
}

saveBytes("house1000.bin", outdata);
