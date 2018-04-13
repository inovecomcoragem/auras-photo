import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../providers/user.service';
import { PhotoService } from '../../providers/photo.service';
import { SensorService } from '../../providers/sensor.service';

declare var p5: any;


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})

export class PhotoComponent implements OnInit, OnDestroy {
  private p5;
  countDown;
  sensorTimeout;

  @ViewChild('p5Canvas') p5Canvas: ElementRef;

  constructor(private userService: UserService,
               private photoService: PhotoService,
               private sensorService: SensorService,
               private router: Router) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.p5 = new p5(this.sketch.bind(this));
      this.countDown = 0;
    }
  }

  ngOnDestroy()	{
    if (this.userService.isLoggedIn()) {
      clearTimeout(this.sensorTimeout);
      this.p5.remove();
    }
  }

  sketch = function(p) {
    const auraFile: String = 'assets/aura-corner.png';
    let capture;
    let cornerAuraMask;
    let brightnessMask, capturePhoto, resultAura;

    const canvasDivWidth = this.p5Canvas.nativeElement.offsetWidth;
    const captureSize = p.createVector(1280, 960);
    const imageSize = p.createVector(720, 960);
    const captureOffset = p.createVector(0, 0);

    const getAndFlipFrame = function(captureObject) {
      const captureImageTemp = p.createImage(imageSize.x, imageSize.y);

      captureImageTemp.copy(captureObject,
                            captureOffset.x, captureOffset.y,
                            captureImageTemp.width, captureImageTemp.height,
                            0, 0,
                            captureImageTemp.width, captureImageTemp.height);

      capturePhoto.push();
      capturePhoto.imageMode(p.CENTER);
      capturePhoto.translate(imageSize.x, 0);
      capturePhoto.scale(-1.0, 1.0);
      capturePhoto.image(captureImageTemp, imageSize.x / 2, imageSize.y / 2);
      capturePhoto.pop();
      return capturePhoto;
    };

    const drawAuras = function(bground) {
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
    };

    const adjustBrightnessContrast = function(pimg, value) {
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
    };

    let updateCounter = function() {
      this.countDown--;
      if (this.countDown > 0) {
        setTimeout(updateCounter, 1000);
      } else {
        drawAuras(adjustBrightnessContrast(capturePhoto, 255));
        capturePhoto.loadPixels();
        resultAura.loadPixels();

        this.photoService.cameraImage = capturePhoto.canvas.toDataURL('image/jpeg');
        this.photoService.auraImage = resultAura.canvas.toDataURL('image/jpeg');

        this.sensorService.setLight('0').subscribe();
        this.router.navigate(['/result']);
      }
    };
    updateCounter = updateCounter.bind(this);

    let takePicture = function() {
      this.countDown = 5;
      setTimeout(updateCounter, 1000);
    };
    takePicture = takePicture.bind(this);
    this.p5Canvas.nativeElement.onclick = takePicture;

    let checkTouch = function() {
      const component = this;
      this.sensorService.getTouch().subscribe(function(data) {
        if (data === 1) {
          component.sensorService.setLight('1').subscribe();
          takePicture();
        } else {
          component.sensorTimeout = setTimeout(checkTouch, 1000);
        }
      });
    };
    checkTouch = checkTouch.bind(this);

    p.preload = function() {
      cornerAuraMask = p.loadImage(auraFile);
    };

    p.setup = function() {
      const canvas = p.createCanvas(canvasDivWidth, 1.333 * canvasDivWidth);
      canvas.parent('p5-canvas');

      if (window.innerWidth < window.innerHeight) {
        // swap capture dimensions
        captureSize.x = captureSize.y + (captureSize.y = captureSize.x, 0);
      }

      capture = p.createCapture(p.VIDEO);
      capture.size(captureSize.x, captureSize.y);
      capture.hide();

      brightnessMask = p.createGraphics(imageSize.x, imageSize.y);
      brightnessMask.pixelDensity(1);

      resultAura = p.createGraphics(imageSize.x, imageSize.y);
      resultAura.pixelDensity(1);

      capturePhoto = p.createGraphics(imageSize.x, imageSize.y);
      capturePhoto.pixelDensity(1);

      p.imageMode(p.CENTER);
      captureOffset.x = (capture.width - capturePhoto.width) / 2;
      captureOffset.y = (capture.height - capturePhoto.height) / 2;

      checkTouch();
    };

    p.draw = function() {
      p.background(0);
      p.image(getAndFlipFrame(capture),
              p.width / 2, p.height / 2,
              p.width, p.height);
    };
  };
}
