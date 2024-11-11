import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import { RolesController } from '@controllers/roles.controller';

export class RoleRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public roles = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.roles.getAll);
    this.router.get(`${this.path}/:id(\\d+)`, this.roles.getById);
    this.router.post(`${this.path}`, this.roles.create);
    this.router.put(`${this.path}/:id(\\d+)`, this.roles.update);
    this.router.patch(`${this.path}/:id(\\d+)/status(true|false)`, this.roles.updateStatus);
  }
}
