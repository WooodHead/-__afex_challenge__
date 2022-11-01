import {
  Controller,
  Body,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards';
import { LoginRequestDto } from './dto';
import { Login } from './interfaces';
import { ApiKeyAuthGuard } from './guards/apikey-auth.guard';
import { HTTP_SWAGGER_401 } from '../common/interfaces';

@UseGuards(ApiKeyAuthGuard)
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for request',
  example: '1af38989-c659-4c97-a80f-8d3d6241fcb9',
  allowEmptyValue: false,
  required: true,
})
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ description: 'Login Successfull', type: Login })
  @ApiUnauthorizedResponse(HTTP_SWAGGER_401)
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: any,
    @Body() loginData: LoginRequestDto,
  ): Promise<Login> {
    if (!loginData) throw new UnauthorizedException();
    return await this.authService.login(req.user);
  }
}
