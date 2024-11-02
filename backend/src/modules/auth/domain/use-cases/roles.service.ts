import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async create(data: CreateRoleDto) {
    const existRole = await this.cnx.findOne(Role, {
      where: {
        name: data.name,
      },
    });

    if (existRole) {
      throw new BadRequestException('Role already exists');
    }

    return await this.cnx.save(Role, data).catch((error) => {
      throw new BadRequestException(error.message);
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

    return await this.cnx.update(Role, id, data).catch((error) => {
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
