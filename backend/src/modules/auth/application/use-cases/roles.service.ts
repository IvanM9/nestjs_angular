import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { Role } from '../../domain/entities/role.entity';
import { RoleOptionsService } from '../../domain/services/role_options.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectEntityManager() private cnx: EntityManager,
    private roleOptions: RoleOptionsService,
  ) {
    this.createAdminRole();
  }

  private async createAdminRole() {
    const role = await this.cnx.findOne(Role, {
      where: {
        name: 'admin',
      },
    });

    if (!role) {
      await this.cnx
        .save(Role, {
          name: 'admin',
          status: true,
        })
        .catch(() => {
          throw new BadRequestException('Error al crear el rol');
        });
    }
  }

  async create(data: CreateRoleDto) {
    const existRole = await this.cnx.findOne(Role, {
      where: {
        name: data.name,
      },
    });

    if (existRole) {
      throw new BadRequestException('Role already exists');
    }

    return await this.cnx.transaction(async (manager) => {
      const createdRole = await manager.save(Role, data).catch(() => {
        throw new BadRequestException('Error al crear el rol');
      });

      for (const option of data.options) {
        await this.roleOptions.assignRoleOptions(
          manager,
          createdRole.id,
          option,
        );
      }

      return createdRole;
    });
  }

  async update(id: number, data: CreateRoleDto) {
    const role = await this.cnx.findOne(Role, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    role.name = data.name;

    return await this.cnx.save(Role, role).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async updateStatus(id: number, status: boolean) {
    const role = await this.cnx.findOne(Role, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return await this.cnx.update(Role, id, { status }).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  async getById(id: number) {
    const role = await this.cnx.findOne(Role, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return role;
  }

  async getAll() {
    return await this.cnx.find(Role);
  }
}
