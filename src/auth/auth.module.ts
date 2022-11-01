import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ApiKeyStrategy, JwtStrategy, LocalStrategy],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret:
            configService.get('JWT_SECRET') || 'my-default-secret-for-dev',
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
