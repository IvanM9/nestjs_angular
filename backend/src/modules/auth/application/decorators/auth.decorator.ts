import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InfoUserInterface } from '../interfaces/info-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<InfoUserInterface> => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    } catch {
      throw new ForbiddenException();
    }
  },
);
