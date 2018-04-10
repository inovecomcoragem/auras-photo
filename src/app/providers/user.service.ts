import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private USER_SERVER_URL = environment.userURL;

  constructor(private http: HttpClient) { }

  user: User = new User();

  getUser(code: string): any {
    return this.http.get(this.USER_SERVER_URL + '/user/' + code);
  }
}
