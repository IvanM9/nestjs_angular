import { EntityManager, IsNull, MoreThan } from 'typeorm';
import moment from 'moment-timezone';
import { Service, Container } from 'typedi';
import { SessionEntity } from '@entities/session.entity';
import { UserService } from '@services/users.service';
import { HttpException } from '@exceptions/HttpException';
import { dbDataSource } from '@database';

@Service()
export class SessionsService {
  cnx: EntityManager;
  userService: UserService = Container.get(UserService);

  constructor() {
    this.cnx = dbDataSource.manager;
  }

  async createSession(userId: number, logged: boolean) {
    const session = this.cnx.create(SessionEntity, {
      firstDate: new Date(),
      logged,
      userId,
    });

    const loggedSession = await this.cnx.save(session);

    if (!logged) {
      const failedAttempts = await this.cnx.count(SessionEntity, {
        where: {
          userId,
          logged: false,
          firstDate: MoreThan(new Date(Date.now() - 1000 * 60 * 60)),
        },
      });

      if (failedAttempts >= 3) {
        await this.userService.updateStatus(userId, false);

        throw new HttpException(400, 'El usuario ha excedido el número de intentos fallidos. El usuario ha sido bloqueado');
      }
    }

    return loggedSession;
  }

  async verifySession(userId: number) {
    return this.cnx.findOne(SessionEntity, {
      where: {
        userId,
        logged: true,
        lastDate: IsNull(),
        firstDate: MoreThan(new Date(Date.now() - 1000 * 60 * 60)),
      },
    });
  }

  async closeSession(sessionId: number) {
    const session = await this.cnx.findOne(SessionEntity, {
      where: { id: sessionId },
    });

    if (!session) {
      throw new HttpException(400, 'Session not found');
    }

    session.lastDate = new Date();

    return this.cnx.save(session);
  }

  async getLatestSession(sessionId: number) {
    const currentSession = await this.cnx.findOne(SessionEntity, {
      where: { id: sessionId },
      select: {
        userId: true,
      },
    });

    const sessions = await this.cnx.find(SessionEntity, {
      where: { userId: currentSession.userId },
      order: { firstDate: 'DESC' },
      take: 10,
    });

    return sessions.map(session => ({
      id: session.id,
      firstDate: moment(session.firstDate).locale('es').tz('America/Guayaquil').format('dddd, MMMM D, YYYY, h:mm a'),
      lastDate: session.lastDate ? moment(session.lastDate).locale('es').tz('America/Guayaquil').format('dddd, MMMM D, YYYY, h:mm a') : null,
      logged: session.logged,
    }));
  }
}
