import { NextFunction, Request, Response } from 'express';
import { RolesService } from '@services/roles.service';
import { Container } from 'typedi';

export class RolesController {
  public rolesService = Container.get(RolesService);

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(201).json({ data: await this.rolesService.create(data), message: 'Rol creado' });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      await this.rolesService.update(id, data);
      res.status(200).json({ message: 'Rol actualizado' });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const status = req.params.status === 'true';

      await this.rolesService.updateStatus(id, status);
      res.status(200).json({ message: 'Estado de rol actualizado' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      res.status(200).json({ data: await this.rolesService.getById(id), message: 'Rol encontrado' });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: await this.rolesService.getAll(), message: 'Roles encontrados' });
    } catch (error) {
      next(error);
    }
  };
}
