import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Person } from '../../domain/entities/person.entity';
import { User } from '../../domain/entities/user.entity';
import { hashSync } from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRolesService } from '../../domain/services/user-roles.service';
import { Session } from 'src/modules/auth/domain/entities/session.entity';
import * as XLSX from 'xlsx';
import { UsersRepository } from '../../infrastructure/persistence/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private cnx: EntityManager,
    private userRolesService: UserRolesService,
    private userRepository: UsersRepository,
  ) {}

  async create(data: CreateUserDto) {
    return await this.cnx.transaction(async (manager) => {
      const existUser = await manager.findOne(User, {
        where: [
          {
            userName: data.userName,
          },
          {
            person: {
              identification: data.identification,
            },
          },
        ],
      });

      if (existUser) {
        throw new BadRequestException('El usuario ya existe');
      }

      const newPerson = {
        firstName: data.firstName,
        lastName: data.lastName,
        identification: data.identification,
        birthDate: data.birthDate,
      };

      const createdPerson = await manager.save(Person, newPerson);

      const randomNum = Math.floor(Math.random() * 1000);
      const initials = `${data.firstName.charAt(0).toLowerCase()}${data.lastName.toLowerCase()}`;
      const email = `${initials}${randomNum}@example.com`;

      const newUser = {
        userName: data.userName,
        password: await hashSync(data.password, 10),
        personId: createdPerson.id,
        email,
      };

      const createdUser = await manager.save(User, newUser).catch((error) => {
        throw new BadRequestException(error.message);
      });

      if (data.rolesId) {
        for (const roleId of data.rolesId) {
          await this.userRolesService.assignRole(
            createdUser.id,
            roleId,
            manager,
          );
        }
      }

      return createdUser;
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
      relations: { person: true },
    });

    if (!existUser) {
      throw new NotFoundException('User not found');
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
    const users = await this.userRepository.getAllUsers(
      this.cnx,
      search,
      page,
      items,
    );

    const allUsers = [];
    for (const user of users.users) {
      const lastSession = await this.cnx.findOne(Session, {
        where: {
          userId: user.id,
        },
        order: {
          firstDate: 'DESC',
        },
        select: {
          logged: true,
          firstDate: true,
          lastDate: true,
        },
      });

      const logged =
        lastSession?.logged && !lastSession?.lastDate ? 'Sí' : 'No';

      allUsers.push({
        id: user.id,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        identification: user.identification,
        birthDate: user.birthDate,
        status: user.status,
        logged,
      });
    }

    return {
      total: users.total,
      users: allUsers,
    };
  }

  async importFromExcel(file: Express.Multer.File) {
    const validKeys = [
      'Nombres',
      'Apellidos',
      'Identificación',
      'Fecha de nacimiento',
      'Usuario',
      'Contraseña',
    ];

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar que el archivo tenga la estructura correcta
      const keys = Object.keys(jsonData[0]);

      const isValid = keys.every((key) => {
        const validated = validKeys.includes(key);

        if (!validated) {
          throw new BadRequestException(
            `La columna ${key} no es válida. Debe ser una de las siguientes: ${validKeys.join(', ')}`,
          );
        }

        return validated;
      });

      if (!isValid) {
        throw new BadRequestException(
          'El archivo no tiene la estructura correcta',
        );
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
    } catch {
      throw new BadRequestException('Error al importar usuarios');
    }
  }
}
