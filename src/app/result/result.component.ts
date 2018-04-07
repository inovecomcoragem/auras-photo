import { Component, OnInit } from '@angular/core';


import { UserService } from '../user.service';
import { User } from '../user';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.user.authorization = true;
  }

}
