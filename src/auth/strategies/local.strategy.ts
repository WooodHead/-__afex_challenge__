import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../entities/';
import { AuthService } from '../auth.service';
import { LoginRequestDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const loginPost: LoginRequestDto = new LoginRequestDto();
    loginPost.email = email;
    loginPost.password = password;
    const user = await this.authService.validateUser(loginPost);

    if (!user) throw new UnauthorizedException(null, 'Invalid credentials');

    return user;
  }
}
