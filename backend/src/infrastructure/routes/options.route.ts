import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import { OptionsController } from '@controllers/options.controller';

export class OptionRoute implements Routes {
  public path = '/options';
  public router = Router();
  public option = new OptionsController();

  constructor(){
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.option.getOptions);
    this.router.get(`${this.path}/:id(\\d+)`, this.option.getOption);
    this.router.post(`${this.path}`, this.option.createOption);
    this.router.put(`${this.path}/:id(\\d+)`, this.option.updateOption);
    this.router.patch(`${this.path}/:id(\\d+)/status(true|false)`, this.option.updateStatus );
  }

}
