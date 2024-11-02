import { RoleEnum } from '../enums/role.enum';

export interface InfoUserInterface {
  id: string;
  sessionId: number;
  role: RoleEnum;
}
