import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginDto } from '../../application/dtos/LoginDto';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectEntityManager() private db: EntityManager,
    private config: ConfigService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.db
      .findOneOrFail(User, {
        where: { userName: payload.user },
        select: { password: true, status: true, id: true },
        relations: {
          roleUsers: true,
        },
      })
      .catch(() => {
        throw new BadRequestException('Usuario no encontrado');
      });

    if (!user.status)
      throw new UnauthorizedException('El usuario se encuentra desactivado');

    if (!(await compare(payload.password, user.password))) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    return {
      token: this.jwt.sign(
        {
          id: user.id,
          user: user.userName,
          role: user.roleUsers,
        },
        {
          expiresIn: '12h',
          secret: this.config.get<string>('jwtSecret'),
        },
      ),
      role: user.roleUsers,
    };
  }
}
