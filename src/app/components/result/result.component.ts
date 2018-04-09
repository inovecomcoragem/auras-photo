import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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

  @ViewChild('photoResult') photoResult: ElementRef;

  constructor(private userService: UserService, private photoService: PhotoService) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.user.authorization = true;
    this.photoResult.nativeElement.style['background-image'] = 'url("' + this.photoService.cameraImage + '")';
  }
}
