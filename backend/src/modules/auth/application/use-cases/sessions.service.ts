import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, IsNull, MoreThan } from 'typeorm';
import { Session } from '../../domain/entities/session.entity';
import { UsersService } from 'src/modules/users/application/use-cases/users.service';
import * as moment from 'moment-timezone';

@Injectable()
export class SessionsService {
  constructor(
    @InjectEntityManager() private cnx: EntityManager,
    private userService: UsersService,
  ) {}

  async createSession(userId: number, logged: boolean) {
    const session = this.cnx.create(Session, {
      firstDate: new Date(),
      logged,
      userId,
    });

    const loggedSession = await this.cnx.save(session);

    if (!logged) {
      const failedAttempts = await this.cnx.count(Session, {
        where: {
          userId,
          logged: false,
          firstDate: MoreThan(new Date(Date.now() - 1000 * 60 * 60)),
        },
      });

      if (failedAttempts >= 3) {
        await this.userService.updateStatus(userId, false);

        throw new BadRequestException(
          'El usuario ha excedido el número de intentos fallidos. El usuario ha sido bloqueado',
        );
      }
    }

    return loggedSession;
  }

  async verifySession(userId: number) {
    return this.cnx.findOne(Session, {
      where: {
        userId,
        logged: true,
        lastDate: IsNull(),
        firstDate: MoreThan(new Date(Date.now() - 1000 * 60 * 60)),
      },
    });
  }

  async closeSession(sessionId: number) {
    const session = await this.cnx.findOne(Session, {
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.lastDate = new Date();

    return this.cnx.save(session);
  }

  async getLatestSession(sessionId: number) {
    const currentSession = await this.cnx.findOne(Session, {
      where: { id: sessionId },
      select: ['userId'],
    });

    const sessions = await this.cnx.find(Session, {
      where: { userId: currentSession.userId },
      order: { firstDate: 'DESC' },
      take: 10,
    });

    return sessions.map((session) => ({
      id: session.id,
      firstDate: moment(session.firstDate)
        .locale('es')
        .tz('America/Guayaquil')
        .format('dddd, MMMM D, YYYY, h:mm a'),
      lastDate: session.lastDate
        ? moment(session.lastDate)
            .locale('es')
            .tz('America/Guayaquil')
            .format('dddd, MMMM D, YYYY, h:mm a')
        : null,
      logged: session.logged,
    }));
  }
}
