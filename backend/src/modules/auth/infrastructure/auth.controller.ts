import { Controller, Headers, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../domain/use-cases/auth.service';
import { LoginDto } from '../application/dtos/LoginDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiHeader({ name: 'user', required: true })
  @ApiHeader({ name: 'password', required: true })
  async login(@Headers() { user, password }: LoginDto) {
    const token = await this.authService.login({ user, password });
    return { data: token, message: 'Bienvenido' };
  }
}
