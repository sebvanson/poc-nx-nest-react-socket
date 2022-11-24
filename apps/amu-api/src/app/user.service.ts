import { Injectable } from '@nestjs/common';
import { DEFAULT_USER } from './user.constants';
import { User } from './user.interface';

@Injectable()
export class UserService {
  getData(): User {
    return DEFAULT_USER;
  }
}
