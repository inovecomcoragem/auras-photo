import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { PhotoService } from '../../providers/photo.service';
import { UserService } from '../../providers/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent implements OnInit {
  user: User;
  showAura = true;

  @ViewChild('photoResult') photoResult: ElementRef;

  constructor(private userService: UserService,
               private photoService: PhotoService,
               private router: Router) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.user = this.userService.user;
      this.user.authorization = true;
      this.toggleAura();
    }
  }

  toggleAura() {
    this.showAura = !this.showAura;

    let imageString = 'url("' + this.photoService.cameraImage + '")';
    if (this.showAura) {
      imageString = 'url("' + this.photoService.auraImage + '")';
    }
    this.photoResult.nativeElement.style['background-image'] = imageString;
  }
}
