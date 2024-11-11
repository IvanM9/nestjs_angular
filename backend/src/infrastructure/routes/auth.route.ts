import { Router } from 'express';
import { AuthController } from '@/infrastructure/controllers/auth.controller';
import { CreateUserDto } from '@/application/dtos/users.dto';
import { Routes } from '@/domain/interfaces/routes.interface';
import { AuthMiddleware } from '@/infrastructure/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/infrastructure/middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(CreateUserDto), this.auth.logIn);
    this.router.post('/logout', AuthMiddleware, this.auth.logOut);
  }
}
