import { Component, OnInit } from '@angular/core';


import { UserService } from '../../providers/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})

export class ShareComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
  }
}
