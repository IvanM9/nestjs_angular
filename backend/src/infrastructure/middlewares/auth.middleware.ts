import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@/infrastructure/config';
import { UserEntity } from '@/domain/entities/users.entity';
import { HttpException } from '@/infrastructure/exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@/domain/interfaces/auth.interface';
import { dbDataSource } from '@database';
import { SessionEntity } from '@/domain/entities/session.entity';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const cnx = dbDataSource.manager;
      const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const findUser = await cnx.findOne(SessionEntity, {
        where: { id },
        select: {
          id: true,
          userId: true,
          logged: true,
          firstDate: true,
          lastDate: true,
        },
      });

      if (findUser) {
        req.session = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
