export class PhotoFunctions {
  p5;
  aura;

  constructor(p5) {
    this.p5 = p5;
    this.aura = p5.loadImage('assets/aura-corner.png');
  }

  calculateOffset = function(video, photo) {
    this.captureOffset = this.p5.createVector((video.width - photo.width) / 2,
                                              (video.height - photo.height) / 2);

    this.dodgeMask = this.p5.createGraphics(photo.width, photo.height);
    this.dodgeMask.pixelDensity(1);

    this.burnMask = this.p5.createGraphics(photo.width, photo.height);
    this.burnMask.pixelDensity(1);
  };

  cropAndFlipFrame = function(videoFrame, resultPhoto) {
    const croppedFrame = this.p5.createImage(resultPhoto.width, resultPhoto.height);

    croppedFrame.copy(videoFrame,
                      this.captureOffset.x, this.captureOffset.y,
                      croppedFrame.width, croppedFrame.height,
                      0, 0,
                      croppedFrame.width, croppedFrame.height);

    resultPhoto.push();
    resultPhoto.imageMode(this.p5.CENTER);
    resultPhoto.translate(resultPhoto.width, 0);
    resultPhoto.scale(-1.0, 1.0);
    resultPhoto.image(croppedFrame, resultPhoto.width / 2, resultPhoto.height / 2);
    resultPhoto.pop();
    return resultPhoto;
  };

  adjustBrightnessContrast = function(photo) {
    const result = this.p5.createImage(photo.width, photo.height);

    this.dodgeMask.background(32);
    this.burnMask.background(128);

    result.copy(photo,
                0, 0, photo.width, photo.height,
                0, 0, result.width, result.height);

    result.blend(this.dodgeMask,
      0, 0, this.dodgeMask.width, this.dodgeMask.height,
      0, 0, result.width, result.height, this.p5.DODGE);

    result.blend(this.burnMask,
      0, 0, this.burnMask.width, this.burnMask.height,
      0, 0, result.width, result.height, this.p5.BURN);

    return result;
  };

  drawAuras = function(photo, result) {
    result.imageMode(this.p5.CENTER);

    result.push();
    result.translate(result.width / 2, result.height / 2);

    result.noTint();
    result.image(photo, 0, 0);

    for (let i = 0; i < 8; i++) {
      if (this.p5.random(1.0) > 0.4) {
        result.push();
        result.rotate(this.p5.TWO_PI * i / 8.0 + this.p5.random(1.0) * this.p5.PI / 8.0);

        if (this.p5.random(1) < 0.333) {
          result.tint(0, 0, 150, 200);
        } else if (this.p5.random(1) < 0.66) {
          result.tint(0, 150, 0, 200);
        } else {
          result.tint(150, 0, 0, 200);
        }

        result.translate(-result.width / this.p5.random(2, 8),
                         -result.height / this.p5.random(2, 8));

        result.image(this.aura, 0, 0, result.width, result.height);

        result.tint(255, 200);
        result.image(this.aura,
                     -result.width / 10, -result.height / 10,
                     result.width, result.height);
        result.pop();
      }
    }
    result.pop();
    return result;
  };
}
