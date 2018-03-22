---
---

var canvasDivWidth = document.getElementById('p5-canvas').offsetWidth;
var questionsDiv = document.getElementsByClassName('questions-container')[0];

var brightnessMask;
var photo, cornerAura;

function preload() {
  cornerAura = loadImage("{{ site.baseurl }}/assets/images/aura-corner.png");
  photo = loadImage("{{ site.baseurl }}/assets/images/tgh.jpg");
}

function setup() {
  var cnv = createCanvas(canvasDivWidth, canvasDivWidth);
  cnv.parent('p5-canvas');

  photo.resize(0, height);
  brightnessMask = createGraphics(width, height);

  imageMode(CENTER);
  image(photo, width/2, height/2);
}

function draw() {}

function drawAuras(bground) {
  bground = bground || photo;

  push();
  translate(width/2, height/2);

  noTint();
  image(bground, 0, 0);

  for (var i=0; i<8; i++) {
    if (random(1.0) > 0.4) {
      push();
      rotate(TWO_PI * i / 8.0 + random(1.0) * PI/8.0);

      if (random(1) < 0.333) {
        tint(0, 0, 150, 200);
      } else if (random(1) < 0.66) {
        tint(0, 150, 0, 200);
      } else {
        tint(150, 0, 0, 200);
      }

      translate(-width/random(2, 8), -height/random(2, 8));
      image(cornerAura, 0, 0, width, height);

      tint(255, 200);
      image(cornerAura, -width/10, -height/10, width, height);
      pop();
    }
  }
  pop();
}

function mousePressed() {
  drawAuras(photo);
  questionsDiv.style.display = "flex";
}

function adjustBrightnessContrast(pimg, value) {
  var original = createImage(pimg.width, pimg.height);
  original.set(0, 0, pimg);

  brightnessMask.beginDraw();
  brightnessMask.background(value);
  brightnessMask.endDraw();

  pimg.blend(brightnessMask,
    0, 0, brightnessMask.width, brightnessMask.height,
    0, 0, pimg.width, pimg.height, DARKEST);

  pimg.blend(original,
    0, 0, original.width, original.height,
    0, 0, pimg.width, pimg.height, BURN);
}
