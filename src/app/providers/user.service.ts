import { Injectable } from '@angular/core';

import { User } from '../models/user.model';


@Injectable()
export class UserService {
  constructor() { }
  user: User = new User();
}
