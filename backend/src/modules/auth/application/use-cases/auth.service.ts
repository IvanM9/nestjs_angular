import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../dtos/LoginDto';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from './sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectEntityManager() private db: EntityManager,
    private config: ConfigService,
    private sessionService: SessionsService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.db
      .findOneOrFail(User, {
        where: [{ userName: payload.user }, { email: payload.user }],
        select: { password: true, status: true, id: true },
        relations: {
          roleUsers: true,
        },
      })
      .catch(() => {
        throw new BadRequestException('Usuario no encontrado');
      });

    if (await this.sessionService.verifySession(user.id)) {
      throw new BadRequestException('El usuario ya tiene una sesión activa');
    }

    if (!user.status)
      throw new UnauthorizedException(
        'El usuario se encuentra desactivado o bloqueado',
      );

    if (!(await compare(payload.password, user.password))) {
      await this.sessionService.createSession(user.id, false);

      throw new BadRequestException('Contraseña incorrecta');
    }

    const sessionData = await this.sessionService.createSession(user.id, true);

    return {
      token: this.jwt.sign(
        {
          id: user.id,
          sessionId: sessionData.id,
          role: user.roleUsers,
        },
        {
          expiresIn: '12h',
          secret: this.config.get<string>('environment.jwtSecret'),
        },
      ),
      role: user.roleUsers,
    };
  }
}
