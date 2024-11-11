import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { SessionsService } from '@services/sessions.service';

export class AuthController {
  public auth = Container.get(AuthService);
  public sessions = Container.get(SessionsService);

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = {
        user:  req.headers.user ? req.headers.user.toString() : '',
        password: req.headers.password ? req.headers.password.toString() : '',
      };
      const { token, role } = await this.auth.login(userData);

      res.status(200).json({ data: {token, role}, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = req.session;
      await this.sessions.closeSession(session.id);

      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  getLastSession = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.session.id;
      const session = await this.sessions.getLatestSession(sessionId);

      res.status(200).json({ data: session, message: 'session' });
    } catch (error) {
      next(error);
    }
  };
}
