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
  currentState: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.user._id = '';
    this.user.email = '';
    this.currentState = 'Waiting';
  }

  getUser() {
    if (this.user._id.length < 6) {
      this.currentState = 'Waiting';
      return;
    }
    this.user._id = this.user._id.toUpperCase();

    const component = this;
    this.userService.getUser(this.user._id).subscribe(
      function(data) {
        component.currentState = 'Found';
        component.userService.user = data;

        setTimeout(function() {
          component.router.navigate(['/photo']);
        }, 800);
      },
      function(error) {
        component.currentState = 'NotFound';
      });
  }

  getResponseClass() {
    if (this.currentState === 'Looking') { return 'form-response-maybe'; }
    if (this.currentState === 'NotFound') { return 'form-response-no'; }
    if (this.currentState === 'Found') { return 'form-response-yes'; }
  }
}
