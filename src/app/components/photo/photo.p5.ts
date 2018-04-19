export class PhotoFunctions {
  p5;
  aura;

  private colors = {
    PROFILE: [ 0x36A9FE, 0xFF4399 ],
    TREND: [ 0xfd5f00, 0xddff00, 0x39ff14, 0x6f00ff, 0xffffff ]
  };

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

    this.dodgeMask.background(18);
    this.burnMask.background(180);

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

  drawAuras = function(photo, result, answers) {
    result.imageMode(this.p5.CENTER);

    result.push();
    result.translate(result.width / 2, result.height / 2);

    result.noTint();
    result.image(photo, 0, 0);

    const auraPos = { PROFILE: 0, TREND: 4 };
    answers.forEach(function(answer) {
      result.push();

      const angle = this.p5.TWO_PI * (auraPos[answer.typeOf] + 0.5) / answers.length;
      result.rotate(angle);
      auraPos[answer.typeOf] += 1;

      this.drawAura(result, this.aura, answer);

      result.pop();
    }.bind(this));

    result.pop();
    return result;
  };

  drawAura = function(photo, aura, answer) {
    photo.push();
    let c;

    if (answer.typeOf === 'TREND') {
      c = this.intToColor(this.colors.TREND[answer.value]);
    } else if (answer.typeOf === 'PROFILE') {
      c = this.lerpColor(this.colors.PROFILE[0],
                         this.colors.PROFILE[1],
                         answer.value);
    }

    photo.translate(this.p5.random(0.4, 0.666) * photo.width,
                    this.p5.random(-0.2, 0.2) * photo.width);

    const scale = (answer.weight > 0.01) ? 1.5 : 0.6;

    c.setAlpha(scale * 120);
    photo.tint(c);
    photo.image(aura, 0, 0, scale * photo.width, scale * photo.height);

    c.setAlpha(scale * 140);
    photo.tint(c);
    photo.image(aura,
                -0.1 * photo.width, 0,
                0.5 * scale * photo.width, 0.5 * scale * photo.height);

    photo.pop();
  };

  lerpValue = function(y0, y1, pos) {
    return (y0 + pos * (y1 - y0));
  };

  lerpColor = function(c0, c1, pos) {
    pos = Math.max(Math.min(pos, 1.0), 0.0);
    const red = this.lerpValue((c0 >> 16 & 0xff), (c1 >> 16 & 0xff), pos) & 0xff;
    const green = this.lerpValue((c0 >> 8 & 0xff), (c1 >> 8 & 0xff), pos) & 0xff;
    const blue = this.lerpValue((c0 >> 0 & 0xff), (c1 >> 0 & 0xff), pos) & 0xff;
    return this.p5.color(red, green, blue);
  };

  intToColor = function(i) {
    const red = (i >> 16 & 0xff);
    const green = (i >> 8 & 0xff);
    const blue = (i >> 0 & 0xff);
    return this.p5.color(red, green, blue);
  };
}
