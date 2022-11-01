import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Callback } from 'aws-lambda';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly authService: AuthService) {
    super(
      { header: 'x-api-key', prefix: '' },
      true,
      async (apiKey: string, done: Callback) => {
        if (this.authService.validateApiKey(apiKey)) {
          done(null, true);
        }
        done(new UnauthorizedException(null, 'Invalid API KEY'), null);
      },
    );
  }
}
