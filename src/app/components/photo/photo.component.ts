import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoService } from '../../providers/photo.service';

declare var p5: any;


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})

export class PhotoComponent implements OnInit, OnDestroy {
  private p5;

  @ViewChild('p5Canvas') p5Canvas: ElementRef;

  constructor(private photoService: PhotoService, private router: Router) { }

  ngOnInit() {
    this.p5 = new p5(this.sketch.bind(this));
  }

  ngOnDestroy()	{
    this.p5.remove();
  }

  sketch = function(p) {
    const auraFile: String = 'assets/aura-corner.png';
    let capture;
    let cornerAuraMask, captureImage;
    let brightnessMask, resultAura;

    const canvasDivWidth = this.p5Canvas.nativeElement.offsetWidth;
    const captureOffset = p.createVector(0, 0);

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

      captureImage = p.createImage(p.width, p.height);
      brightnessMask = p.createGraphics(p.width, p.height);
      brightnessMask.pixelDensity(1);
      resultAura = p.createGraphics(p.width, p.height);
      resultAura.pixelDensity(1);

      p.imageMode(p.CENTER);
      captureOffset.x = (capture.width - captureImage.width) / 2;
      captureOffset.y = (capture.height - captureImage.height) / 2;
    };

    p.draw = function() {
      p.background(0);

      captureImage.copy(capture,
                        captureOffset.x, captureOffset.y,
                        captureImage.width, captureImage.height,
                        0, 0,
                        captureImage.width, captureImage.height);
      p.image(captureImage, p.width / 2, p.height / 2);
    };

    let takePicture = function() {
      drawAuras(adjustBrightnessContrast(captureImage, 255));

      captureImage.loadPixels();
      resultAura.loadPixels();

      this.photoService.cameraImage = captureImage.canvas.toDataURL();
      this.photoService.auraImage = resultAura.canvas.toDataURL();

      this.router.navigate(['/result']);
    };
    takePicture = takePicture.bind(this);
    this.p5Canvas.nativeElement.onclick = takePicture;

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
      const result = p.createImage(pimg.width, pimg.height);

      result.copy(pimg,
                  0, 0, pimg.width, pimg.height,
                  0, 0, result.width, result.height);

      brightnessMask.background(value);

      result.blend(brightnessMask,
        0, 0, brightnessMask.width, brightnessMask.height,
        0, 0, result.width, result.height, p.DARKEST);

      result.blend(pimg,
        0, 0, pimg.width, pimg.height,
        0, 0, result.width, result.height, p.BURN);

      return result;
    }
  };
}
