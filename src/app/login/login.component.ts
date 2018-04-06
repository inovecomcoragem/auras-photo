import { Component, OnInit } from '@angular/core';


import { UserService } from '../user.service';
import { User } from '../user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  user: User;
  foundUser = true;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
  }
}
