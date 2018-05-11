import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { PhotoService } from '../../providers/photo.service';
import { UserService } from '../../providers/user.service';
import { User } from '../../models/user.model';

declare var QRCode: any;


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})

export class ShareComponent implements OnInit {
  user: User;
  imageUploading: boolean;

  @ViewChild('qrCanvas') qrCanvas: ElementRef;

  constructor(private userService: UserService,
               private photoService: PhotoService,
               private router: Router) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.user = this.userService.user;
      this.imageUploading = false;
      this.userService.user.image = this.photoService.auraImage.replace(/^data:image\/[jpengig]+;base64,/, '');
    }
  }

  submit() {
    this.imageUploading = true;
    this.userService.sendImage(this.user).subscribe(function(data) {
      window.location.href = './';
    }.bind(this));
  }
}
