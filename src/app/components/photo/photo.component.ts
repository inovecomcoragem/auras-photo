import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


declare var p5: any;


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  private p5;

  @ViewChild('p5Canvas') p5Canvas: ElementRef;

  constructor() { }

  ngOnInit() {
    this.p5 = new p5(this.sketch.bind(this));
  }

  sketch = function(p) {
    const auraFile: String = 'assets/aura-corner.png';
    let capture;
    let cornerAuraMask, captureImage;
    let brightnessMask, resultAura;

    const canvasDivWidth = this.p5Canvas.nativeElement.offsetWidth;
    this.p5Canvas.nativeElement.onclick = takePicture;

    // TEMP
    let pictureTaken = false;

    p.preload = function() {
      cornerAuraMask = p.loadImage(auraFile);
    };

    p.setup = function() {
      // let isPortrait = (window.innerHeight > window.innerWidth);
      const canvas = p.createCanvas(canvasDivWidth, canvasDivWidth);
      canvas.parent('p5-canvas');

      capture = p.createCapture(p.VIDEO);
      capture.size(960, 720);
      capture.hide();

      captureImage = p.createImage(capture.width, capture.height);
      brightnessMask = p.createGraphics(p.width, p.height);
      brightnessMask.pixelDensity(1);
      resultAura = p.createGraphics(p.width, p.height);
      resultAura.pixelDensity(1);

      p.imageMode(p.CENTER);
    };

    p.draw = function() {
      p.background(0);
      if (!pictureTaken) {
        captureImage.copy(capture,
                          0, 0, capture.width, capture.height,
                          0, 0, captureImage.width, captureImage.height);
        adjustBrightnessContrast(captureImage, 255);
        p.image(captureImage, p.width / 2, p.height / 2);
      } else {
        p.image(resultAura, p.width / 2, p.height / 2);
      }
    };

    function takePicture() {
      // save captureImage
      drawAuras(captureImage);
      pictureTaken = true;
      // save aura pic and go to next page
    }

    function drawAuras(bground) {
      resultAura.imageMode(p.CENTER);

      resultAura.push();
      resultAura.translate(resultAura.width / 2, resultAura.height / 2);

      resultAura.noTint();
      resultAura.image(bground, 0, 0);

      for (let i = 0; i < 8; i++) {
        if (p.random(1.0) > 0.4) {
          resultAura.push();
          resultAura.rotate(p.TWO_PI * i / 8.0 + p.random(1.0) * p.PI / 8.0);

          if (p.random(1) < 0.333) {
            resultAura.tint(0, 0, 150, 200);
          } else if (p.random(1) < 0.66) {
            resultAura.tint(0, 150, 0, 200);
          } else {
            resultAura.tint(150, 0, 0, 200);
          }

          resultAura.translate(-resultAura.width / p.random(2, 8),
                               -resultAura.height / p.random(2, 8));
          resultAura.image(cornerAuraMask, 0, 0, resultAura.width, resultAura.height);

          resultAura.tint(255, 200);
          resultAura.image(cornerAuraMask,
                           -resultAura.width / 10, -resultAura.height / 10,
                           resultAura.width, resultAura.height);
          resultAura.pop();
        }
      }
      resultAura.pop();
    }

    function adjustBrightnessContrast(pimg, value) {
      const original = p.createImage(pimg.width, pimg.height);
      original.copy(pimg,
                    0, 0, pimg.width, pimg.height,
                    0, 0, original.width, original.height);

      brightnessMask.background(value);

      pimg.blend(brightnessMask,
        0, 0, brightnessMask.width, brightnessMask.height,
        0, 0, pimg.width, pimg.height, p.DARKEST);

      pimg.blend(original,
        0, 0, original.width, original.height,
        0, 0, pimg.width, pimg.height, p.BURN);
    }
  };
}
