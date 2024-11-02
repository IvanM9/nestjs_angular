import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Person } from '../entities/person.entity';
import { User } from '../entities/user.entity';
import { hashSync } from 'bcrypt';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async create(data: CreateUserDto) {
    return await this.cnx.transaction(async (manager) => {
      const existUser = await manager.findOne(User, {
        where: {
          email: data.email,
          userName: data.userName,
          person: {
            identification: data.identification,
          },
        },
      });

      if (existUser) {
        throw new BadRequestException('User already exists');
      }

      const newPerson = {
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        birthDate: data.birthDate,
      };

      const createdPerson = await manager.save(Person, newPerson);

      const newUser = {
        userName: data.userName,
        email: data.email,
        password: await hashSync(data.password, 10),
        personId: createdPerson.id,
      };

      return await manager.save(User, newUser).catch((error) => {
        throw new BadRequestException(error.message);
      });
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.cnx.findOne(User, {
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.cnx
      .update(Person, user.personId, {
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        birthDate: data.birthDate,
      })
      .catch(() => {
        throw new BadRequestException('Error updating person');
      });
  }

  async updateStatus(id: number, status: boolean) {
    const user = await this.cnx.findOne(User, {
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.cnx
      .update(User, id, {
        status,
      })
      .catch(() => {
        throw new BadRequestException('Error updating status');
      });
  }

  async getById(id: number) {
    const existUser = await this.cnx.findOne(User, {
      where: {
        id,
      },
    });

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    return existUser;
  }
}
