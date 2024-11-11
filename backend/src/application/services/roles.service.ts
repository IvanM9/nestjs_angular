import { HttpException } from '@exceptions/HttpException';
import { RoleEntity } from '@entities/role.entity';
import { Service, Container } from 'typedi';
import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '@dtos/create-role.dto';
import { RoleOptionsService } from '@services/role_options.service';
import { dbDataSource } from '@database';

@Service()
export class RolesService {
  cnx: EntityManager;
  roleOptions = Container.get(RoleOptionsService);

  constructor() {
    this.cnx = dbDataSource.manager;
  }

  async createAdminRole() {
    const role = await this.cnx.findOne(RoleEntity, {
      where: {
        name: 'admin',
      },
    });

    if (!role) {
      await this.cnx
        .save(RoleEntity, {
          name: 'admin',
          status: true,
        })
        .catch(() => {
          throw new HttpException(400, 'Error al crear el rol');
        });
    }
  }

  async create(data: CreateRoleDto) {
    const existRole = await this.cnx.findOne(RoleEntity, {
      where: {
        name: data.name,
      },
    });

    if (existRole) {
      throw new HttpException(400, 'Role already exists');
    }

    return await this.cnx.transaction(async manager => {
      const createdRole = await manager.save(RoleEntity, data).catch(() => {
        throw new HttpException(400, 'Error al crear el rol');
      });

      for (const option of data.options) {
        await this.roleOptions.assignRoleOptions(manager, createdRole.id, option);
      }

      return createdRole;
    });
  }

  async update(id: number, data: CreateRoleDto) {
    const role = await this.cnx.findOne(RoleEntity, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new HttpException(400, 'Role not found');
    }

    role.name = data.name;

    return await this.cnx.save(RoleEntity, role).catch(error => {
      throw new HttpException(400, error.message);
    });
  }

  async updateStatus(id: number, status: boolean) {
    const role = await this.cnx.findOne(RoleEntity, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new HttpException(400, 'Role not found');
    }

    return await this.cnx.update(RoleEntity, id, { status }).catch(error => {
      throw new HttpException(400, error.message);
    });
  }

  async getById(id: number) {
    const role = await this.cnx.findOne(RoleEntity, {
      where: {
        id,
      },
    });

    if (!role) {
      throw new HttpException(400, 'Role not found');
    }

    return role;
  }

  async getAll() {
    return await this.cnx.find(RoleEntity);
  }
}
