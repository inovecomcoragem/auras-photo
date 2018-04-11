import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private USER_SERVER_URL = environment.backendURL;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  user: User = new User();

  getUser(_id: string): any {
    return this.http.get(this.USER_SERVER_URL + '/person/' + _id + '/results');
  }

  isLoggedIn(): boolean {
    return (this.user.email && (this.user.email !== ''));
  }

  sendImage(user): any {
    const postUrl = this.USER_SERVER_URL + '/person/' + user._id + '/photo';
    return this.http.post(postUrl, user, this.httpOptions);
  }
}
