import { Injectable } from '@nestjs/common';
import { User } from './entities';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto';
import { JwtPayload, Login } from './interfaces/';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateApiKey(apiKey: string) {
    const apiKeys: Array<string> = JSON.parse(process.env.API_KEYS!);

    if (!process.env.API_KEYS) return false;

    if (!Array.isArray(apiKeys)) return false;

    return apiKeys.find((key) => apiKey === key);
  }

  async validateUser(validateUser: LoginRequestDto): Promise<any> {
    const { password, email } = validateUser;

    const user = await this.usersService.findOne(email);

    if (!user || !bcrypt.compareSync(password, user!.password)) return;

    return user;
  }

  async login(user: User): Promise<Login> {
    const payload: JwtPayload = { sub: user.id! };

    const ret: Login = {
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      access_token: this.jwtService.sign(payload),
    };

    return ret;
  }
}
