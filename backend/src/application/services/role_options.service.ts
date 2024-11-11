import { OptionEntity } from '@entities/option.entity';
import { RoleOptionsEntity } from '@entities/role-options.entity';
import { HttpException } from '@/infrastructure/exceptions/HttpException';
import { Service } from 'typedi';
import { EntityManager } from 'typeorm';

@Service()
export class RoleOptionsService {
  async assignRoleOptions(cnx: EntityManager, roleId: number, optionId: number) {
    const existOption = await cnx.findOne(OptionEntity, {
      where: {
        id: optionId,
        status: true,
      },
    });

    if (!existOption) {
      throw new HttpException(400, 'Opción no encontrada');
    }

    return await cnx.save(RoleOptionsEntity, { roleId, optionId }).catch(() => {
      throw new HttpException(400, 'Error al asignar la opción al rol');
    });
  }
}
