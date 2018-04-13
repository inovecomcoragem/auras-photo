import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../providers/user.service';
import { PhotoService } from '../../providers/photo.service';
import { SensorService } from '../../providers/sensor.service';

import { PhotoFunctions } from './photo.p5';

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
    const thisComponent = this;
    const photoFunctions = new PhotoFunctions(p);
    let video;
    let capturePhoto, auraPhoto;

    const captureSize = p.createVector(1280, 960);
    const imageSize = p.createVector(720, 960);

    const updateCounter = function() {
      thisComponent.countDown--;
      if (thisComponent.countDown > 0) {
        setTimeout(updateCounter, 1000);
      } else {
        const adjusted = photoFunctions.adjustBrightnessContrast(capturePhoto);
        photoFunctions.drawAuras(adjusted, auraPhoto);
        capturePhoto.loadPixels();
        auraPhoto.loadPixels();

        thisComponent.photoService.cameraImage = capturePhoto.canvas.toDataURL('image/jpeg');
        thisComponent.photoService.auraImage = auraPhoto.canvas.toDataURL('image/jpeg');

        thisComponent.sensorService.setLight('0').subscribe();
        thisComponent.router.navigate(['/result']);
      }
    };

    const takePicture = function() {
      thisComponent.countDown = 5;
      setTimeout(updateCounter, 1000);
    };
    this.p5Canvas.nativeElement.onclick = takePicture;

    const checkTouch = function() {
      thisComponent.sensorService.getTouch().subscribe(function(data) {
        if (data === 1) {
          thisComponent.sensorService.setLight('1').subscribe();
          takePicture();
        } else {
          thisComponent.sensorTimeout = setTimeout(checkTouch, 1000);
        }
      });
    };

    p.setup = function() {
      const canvasDivWidth = thisComponent.p5Canvas.nativeElement.offsetWidth;
      const canvas = p.createCanvas(canvasDivWidth, 1.333 * canvasDivWidth);
      canvas.parent('p5-canvas');

      if (window.innerWidth < window.innerHeight) {
        // swap capture dimensions
        captureSize.x = captureSize.y + (captureSize.y = captureSize.x, 0);
      }

      video = p.createCapture(p.VIDEO);
      video.size(captureSize.x, captureSize.y);
      video.hide();

      auraPhoto = p.createGraphics(imageSize.x, imageSize.y);
      auraPhoto.pixelDensity(1);

      capturePhoto = p.createGraphics(imageSize.x, imageSize.y);
      capturePhoto.pixelDensity(1);

      photoFunctions.calculateOffset(video, capturePhoto);
      p.imageMode(p.CENTER);
      checkTouch();
    };

    p.draw = function() {
      p.background(0);
      p.image(photoFunctions.cropAndFlipFrame(video, capturePhoto),
              p.width / 2, p.height / 2,
              p.width, p.height);
    };
  };
}
