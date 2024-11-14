import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@/domain/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const search = req.query.search ? (req.query.search as string) : null;
      const page = req.query.page ? Number(req.query.page) : null;
      const items = req.query.items ? Number(req.query.items) : null;

      const findAllUsersData = await this.user.getAllUsers(search, page, items);

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData = await this.user.getById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData = await this.user.create(userData);

      res.status(201).json(createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;
      await this.user.update(userId, userData);

      res.status(200).json({ message: 'Actualizado' });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const status = req.params.status === 'true';
      await this.user.updateStatus(userId, status);

      res.status(200).json({ message: 'Estado modificado' });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { newPassword, username } = req.body;
      const changePasswordData = await this.user.changePassword(username, newPassword);

      res.status(200).json({ data: changePasswordData, message: 'Contraseña cambiada' });
    } catch (error) {
      next(error);
    }
  }

  importFromExcel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      if (!req.file) {
        throw new Error('No se ha subido ningún archivo');
      }

      const importData = await this.user.importFromExcel(req.file);

      res.status(200).json(importData);
    } catch (error) {
      next(error);
    }
  }

  myInformation = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.userId;
      const myInformationData = await this.user.getById(userId);

      res.status(200).json({ data: myInformationData, message: 'Información encontrada' });
    } catch (error) {
      next(error);
    }
  }

}
