import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../providers/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  user: User;
  foundUser = true;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.user._id = '';
    this.user.email = '';
  }

  getUser() {
    const component = this;
    this.userService.getUser(this.user._id).subscribe(
      function(data) {
        component.foundUser = true;
        data['_id'] = component.user._id;
        component.userService.user = data;
        component.router.navigate(['/photo']);
      },
      function(error) {
        component.foundUser = false;
      });
  }
}
