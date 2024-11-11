import { NextFunction, Request, Response } from 'express';
import { OptionsService } from '@services/options.service';
import Container from 'typedi';

export class OptionsController {
  service = Container.get(OptionsService);

  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ data: await this.service.getOptions() });
    } catch (error) {
      next(error);
    }
  }

  async createOption(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({ data: await this.service.createOption(req.body) });
    } catch (error) {
      next(error);
    }
  }

  async getOption(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      res.status(200).json({ data: await this.service.getOption(id) });
    } catch (error) {
      next(error);
    }
  }

  async updateOption(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      res.status(200).json({ data: await this.service.update(id, req.body) });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const status = req.params.status === 'true';

      res.status(200).json({ data: await this.service.updateStatus(id, status) });
    } catch (error) {
      next(error);
    }
  }
}
