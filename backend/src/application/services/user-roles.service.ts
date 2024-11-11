import { RoleUserEntity } from '@entities/role-user.entity';
import { RoleEntity } from '@entities/role.entity';
import { HttpException } from '@exceptions/HttpException';
import { Service } from 'typedi';
import { EntityManager } from 'typeorm';

@Service()
export class UserRolesService {
  async assignRole(userId: number, roleId: number, cnx: EntityManager) {
    const existRole = await cnx.findOne(RoleEntity, {
      where: {
        id: roleId,
        status: true,
      },
    });

    if (!existRole) {
      throw new HttpException(400, 'Rol no encontrado');
    }

    return await cnx.save(RoleUserEntity, { userId, roleId }).catch(() => {
      throw new HttpException(400, 'Error al asignar el rol');
    });
  }
}
