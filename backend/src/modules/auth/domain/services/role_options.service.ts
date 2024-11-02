import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RoleOptions } from '../entities/role-options.entity';
import { Option } from '../entities/option.entity';

@Injectable()
export class RoleOptionsService {
  async assignRoleOptions(
    cnx: EntityManager,
    roleId: number,
    optionId: number,
  ) {
    const existOption = await cnx.findOne(Option, {
      where: {
        id: optionId,
        status: true,
      },
    });

    if (!existOption) {
      throw new BadRequestException('Opción no encontrada');
    }

    return await cnx.save(RoleOptions, { roleId, optionId }).catch(() => {
      throw new BadRequestException('Error al asignar la opción al rol');
    });
  }
}
