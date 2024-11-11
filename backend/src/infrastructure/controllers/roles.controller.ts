import { NextFunction, Request, Response } from 'express';
import { RolesService } from '@services/roles.service';
import Container from 'typedi';

export class RolesController {
  public rolesService = Container.get(RolesService);

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      res.status(201).json({ data: await this.rolesService.create(data) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      await this.rolesService.update(id, data);
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const status = req.params.status === 'true';

      await this.rolesService.updateStatus(id, status);
      res.status(200).json({ message: 'Role status updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      res.status(200).json({ data: await this.rolesService.getById(id) });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: await this.rolesService.getAll() });
    } catch (error) {
      next(error);
    }
  }
}
