import { Controller, Headers, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../../application/use-cases/auth.service';
import { LoginDto } from '../../application/dtos/LoginDto';
import { JwtAuthGuard } from '../../application/guards/jwt-auth.guard';
import { CurrentUser } from '../../application/decorators/auth.decorator';
import { InfoUserInterface } from '../../application/interfaces/info-user.interface';
import { SessionsService } from '../../application/use-cases/sessions.service';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionsService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiHeader({ name: 'user', required: true })
  @ApiHeader({ name: 'password', required: true })
  async login(@Headers() { user, password }: LoginDto) {
    const token = await this.authService.login({ user, password });
    return { data: token, message: 'Bienvenido' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() { sessionId }: InfoUserInterface) {
    await this.sessionService.closeSession(sessionId);
    return { message: 'Sesión cerrada' };
  }
}
