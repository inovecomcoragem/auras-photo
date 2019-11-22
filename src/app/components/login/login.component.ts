import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private userService: UserService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.user._id = '';
    this.user.email = '';
    this.currentState = 'Waiting';

    this.activatedRoute.params.subscribe(
      params => {
        if (params.id) {
          this.user._id = params.id.toUpperCase().substring(0, 6);
          this.getUser();
        }
      });
  }

  getUser() {
    if (this.user._id.length < 6) {
      this.currentState = 'Waiting';
      return;
    }
    this.currentState = 'Looking';

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
}
