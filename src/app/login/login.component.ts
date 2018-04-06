import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  user: LoginCredentials = {
    email: '',
    code: ''
  };

  foundUser: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}

interface LoginCredentials {
  email: string;
  code: string;
}
