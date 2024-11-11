import { hashSync } from 'bcrypt';
import { EntityManager, MoreThan } from 'typeorm';
import { Service } from 'typedi';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { PersonEntity } from '@entities/person.entity';
import { SessionEntity } from '@entities/session.entity';
import { RoleEntity } from '@entities/role.entity';
import { UserRolesService } from './user-roles.service';
import { UsersRepository } from '@repositories/users.repository';
import { ADMIN_PASSWORD, ADMIN_USER } from '@config';
import * as XLSX from 'xlsx';
import { dbDataSource } from '@database';

@Service()
export class UserService {
  cnx: EntityManager;
  constructor(private userRepository: UsersRepository, private userRolesService: UserRolesService) {
    this.cnx = dbDataSource.manager;
  }

  async create(data: CreateUserDto) {
    return await this.cnx.transaction(async manager => {
      const existUser = await manager.findOne(UserEntity, {
        where: [
          {
            userName: data.userName,
          },
          {
            person: await manager.findOne(PersonEntity, {
              where: { identification: data.identification },
            }),
          },
        ],
      });

      if (existUser) {
        throw new HttpException(400, 'El usuario ya existe');
      }

      const newPerson = {
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        birthDate: data.birthDate,
      };

      const createdPerson = await manager.save(PersonEntity, newPerson);

      const randomNum = Math.floor(Math.random() * 1000);
      const initials = `${data.firstName.charAt(0).toLowerCase()}${data.lastName.toLowerCase()}`;
      const email = `${initials}${randomNum}@example.com`;

      const newUser = {
        userName: data.userName,
        password: await hashSync(data.password, 10),
        personId: createdPerson.id,
        email,
      };

      const createdUser = await manager.save(UserEntity, newUser).catch(error => {
        throw new HttpException(400, error.message);
      });

      if (data.rolesId) {
        for (const roleId of data.rolesId) {
          await this.userRolesService.assignRole(createdUser.id, roleId, manager);
        }
      }

      return createdUser;
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.cnx.findOne(UserEntity, {
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(400, 'User not found');
    }

    return await this.cnx
      .update(PersonEntity, user.personId, {
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        birthDate: data.birthDate,
      })
      .catch(() => {
        throw new HttpException(400, 'Error updating person');
      });
  }

  async updateStatus(id: number, status: boolean) {
    const user = await this.cnx.findOne(UserEntity, {
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(400, 'User not found');
    }

    return await this.cnx
      .update(UserEntity, id, {
        status,
      })
      .catch(() => {
        throw new HttpException(400, 'Error updating status');
      });
  }

  async getById(id: number) {
    const existUser = await this.cnx.findOne(UserEntity, {
      where: { id: id },
      relations: ['person'],
    });

    if (!existUser) {
      throw new HttpException(400, 'User not found');
    }

    return {
      id: existUser.id,
      userName: existUser.userName,
      email: existUser.email,
      firstName: existUser.person.firstName,
      lastName: existUser.person.lastName,
      identification: existUser.person.identification,
      birthDate: existUser.person.birthDate,
      status: existUser.status,
    };
  }

  async getAllUsers(search: string, page: number, items: number) {
    const users = await this.userRepository.getAllUsers(this.cnx, search, page, items);

    const allUsers = [];
    for (const user of users.users) {
      const numAttempts = await this.cnx.count(SessionEntity, {
        where: {
          userId: user.id,
          firstDate: MoreThan(new Date(Date.now() - 1000 * 60 * 60)),
        },
      });

      allUsers.push({
        id: user.id,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        identification: user.identification,
        birthDate: user.birthDate,
        status: user.status,
        logged: user.logged,
        numAttempts
      });
    }

    return {
      total: users.total,
      users: allUsers,
    };
  }

  async importFromExcel(file: Express.Multer.File) {
    const validKeys = ['Nombres', 'Apellidos', 'Identificación', 'Fecha de nacimiento', 'Usuario', 'Contraseña'];

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar que el archivo tenga la estructura correcta
      const keys = Object.keys(jsonData[0]);

      const isValid = keys.every(key => {
        const validated = validKeys.includes(key);

        if (!validated) {
          throw new HttpException(400, `La columna ${key} no es válida. Debe ser una de las siguientes: ${validKeys.join(', ')}`);
        }

        return validated;
      });

      if (!isValid) {
        throw new HttpException(400, 'El archivo no tiene la estructura correcta');
      }

      for (const student of jsonData) {
        const data: CreateUserDto = {
          firstName: student['Nombres'],
          lastName: student['Apellidos'],
          identification: `${student['Identificación']}`,
          birthDate: new Date(student['Fecha de nacimiento']),
          userName: student['Usuario'],
          password: student['Contraseña'],
          rolesId: [],
        };

        await this.create(data);
      }

      return { message: 'Usuarios creados correctamente' };
    } catch (e) {
      console.log(e.message);
      throw new HttpException(400, 'Error al importar usuarios');
    }
  }

  async createAdmin() {
    const admin = await this.cnx.findOne(UserEntity, {
      where: {
        userName: ADMIN_USER,
      },
    });

    if (!admin) {
      const newAdmin: CreateUserDto = {
        firstName: 'Admin',
        lastName: 'Admin',
        identification: '1234567890',
        birthDate: new Date(),
        userName: ADMIN_USER,
        password: ADMIN_PASSWORD,
        rolesId: [],
      };

      const adminRole = await this.cnx.findOne(RoleEntity, {
        where: {
          name: 'admin',
        },
        select: ['id'],
      });

      if (adminRole) {
        newAdmin.rolesId.push(adminRole.id);
      }

      await this.create(newAdmin);
    }
  }

  async changePassword(userName: string, newPassword: string) {
    const user = await this.cnx.findOne(UserEntity, {
      where: {
        userName,
      },
    });

    if (!user) {
      throw new HttpException(400, 'Usuario no encontrado');
    }

    return await this.cnx
      .update(UserEntity, user.id, {
        password: await hashSync(newPassword, 10),
      })
      .catch(() => {
        throw new HttpException(400, 'Error al cambiar la contraseña');
      });
  }
}
