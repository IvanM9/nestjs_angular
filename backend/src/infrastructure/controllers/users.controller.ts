import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import { CreateUserDto } from '@dtos/users.dto';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search ? (req.query.search as string) : null;
      const page = req.query.page ? Number(req.query.page) : null;
      const items = req.query.items ? Number(req.query.items) : null;

      const findAllUsersData = await this.user.getAllUsers(search, page, items);

      res.status(200).json({ data: findAllUsersData, message: 'Usuarios encontrados' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData = await this.user.getById(userId);

      res.status(200).json({ data: findOneUserData, message: 'Usuario encontrado' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData = await this.user.create(userData);

      res.status(201).json({ data: createUserData, message: 'Creado' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;
      const updateUserData = await this.user.update(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'Actualizado' });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const status = req.params.status === 'true';
      const deleteUserData = await this.user.updateStatus(userId, status);

      res.status(200).json({ data: deleteUserData, message: 'Estado modificado' });
    } catch (error) {
      next(error);
    }
  };
}