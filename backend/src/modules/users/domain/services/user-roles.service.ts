import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectEntityManager } from '@nestjs/typeorm';
import { RoleUser } from 'src/modules/auth/domain/entities/role-user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserRolesService {
  //   constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async assignRole(userId: number, roleId: number, cnx: EntityManager) {
    return await cnx.save(RoleUser, { userId, roleId }).catch(() => {
      throw new BadRequestException('Error al asignar el rol');
    });
  }
}
