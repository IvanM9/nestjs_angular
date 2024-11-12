import { Router } from 'express';
import { UserController } from '@/infrastructure/controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@/application/dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@/infrastructure/middlewares/validation.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();
  upload = multer({ storage: multer.memoryStorage() });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, AuthMiddleware, this.user.getUsers);
    this.router.get(`${this.path}/by-id/:id(\\d+)`, AuthMiddleware, this.user.getUserById);
    this.router.post(`${this.path}/create`, AuthMiddleware, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/update/:id(\\d+)`, AuthMiddleware, ValidationMiddleware(UpdateUserDto, true), this.user.updateUser);
    this.router.patch(`${this.path}/update-status/:id(\\d+)/:status(true|false)`, AuthMiddleware, this.user.updateStatus);
    this.router.patch(`${this.path}/change-password`, this.user.changePassword);
    this.router.post(`${this.path}/import-from-excel`, [AuthMiddleware, this.upload.single('file')], this.user.importFromExcel);
    this.router.get(`${this.path}/my-information`, AuthMiddleware, this.user.myInformation);
  }
}
