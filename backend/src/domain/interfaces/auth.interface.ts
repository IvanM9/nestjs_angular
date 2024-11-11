import { Request } from 'express';
import { User } from '@/domain/interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

interface SessionInterface {
  id: number;
  userId: number;
  failed: boolean;
  firstDate: Date;
  lastDate: Date;
}

export interface RequestWithUser extends Request {
  session: SessionInterface;
}
