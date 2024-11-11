import { Router } from 'express';
import { UserController } from '@/infrastructure/controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@/application/dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@/infrastructure/middlewares/validation.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.user.getUsers);
    this.router.get(`${this.path}/by-id/:id(\\d+)`, this.user.getUserById);
    this.router.post(`${this.path}/create`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/update/:id(\\d+)`, ValidationMiddleware(UpdateUserDto, true), this.user.updateUser);
    this.router.patch(`${this.path}/update-status/:id(\\d+)/:status(true|false)`, this.user.updateStatus);
    this.router.patch(`${this.path}/change-password`, this.user.changePassword);
    this.router.post(`${this.path}/import-from-excel`, this.user.importFromExcel);
  }
}
