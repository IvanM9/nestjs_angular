import { NextFunction, Request, Response } from 'express';
import { OptionsService } from '@services/options.service';
import Container from 'typedi';

export class OptionsController {
  service = Container.get(OptionsService);

  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: await this.service.getOptions(), message: 'Opciones encontradas' });
    } catch (error) {
      next(error);
    }
  };

  createOption = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json({ data: await this.service.createOption(req.body), message: 'Creado' });
    } catch (error) {
      next(error);
    }
  };

  getOption = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      res.status(200).json({ data: await this.service.getOption(id), message: 'Opción encontrada' });
    } catch (error) {
      next(error);
    }
  };

  updateOption = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      res.status(200).json({ data: await this.service.update(id, req.body), message: 'Actualizado' });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const status = req.params.status === 'true';

      res.status(200).json({ data: await this.service.updateStatus(id, status), message: 'Estado actualizado' });
    } catch (error) {
      next(error);
    }
  };
}
