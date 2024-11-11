import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/domain/interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { dbDataSource } from '@database';
import { SessionsService } from './sessions.service';

const createToken = (sessionId: number): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: sessionId };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 60 * 60 * 24;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  cnx: EntityManager;
  sessionService = Container.get(SessionsService);

  constructor() {
    this.cnx = dbDataSource.manager;
  }

  public async login(userData: User): Promise<{ token: string }> {
    const user = await this.cnx
      .findOneOrFail(UserEntity, {
        where: [{ userName: userData.user }, { email: userData.user }],
        select: { password: true, status: true, id: true },
        relations: {
          roleUsers: {
            role: true,
          },
        },
      })
      .catch(() => {
        throw new HttpException(409, 'Usuario no encontrado');
      });

    if (await this.sessionService.verifySession(user.id)) {
      throw new HttpException(409, 'El usuario ya tiene una sesión activa');
    }

    if (!user.status)
      throw new HttpException(409,'El usuario se encuentra desactivado o bloqueado',
      );

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) {
      await this.sessionService.createSession(user.id, false);
      throw new HttpException(409, 'Password not matching');
    }

    const newSession = await this.sessionService.createSession(user.id, true);

    const tokenData = createToken(newSession.id);
    // const cookie = createCookie(tokenData);

    return { token: tokenData.token };
  }
}
