import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserInterface } from '../../application/interfaces/user.interface';

@Injectable()
export class UsersRepository {
  async update(cnx: EntityManager, id: number, data: UpdateUserDto) {
    const query = cnx
      .createQueryBuilder()
      .update(User)
      .set(data)
      .where('id = :id', { id });

    return await query.execute();
  }

  async getAllUsers(
    cnx: EntityManager,
    search: string,
    page: number = 1,
    items: number = 5,
  ) {
    console.log(search, page, items);

    const query = cnx
      .createQueryBuilder()
      .select([
        'user.id as id',
        'person.first_name as "firstName"',
        'person.last_name as "lastName"',
        'person.identification as identification',
        'person.birth_date as "birthDate"',
        'user.status as status',
        'user.user_name as "userName"',
        'user.email as email',
      ])
      .from(User, 'user')
      .leftJoinAndSelect('user.person', 'person')
      .limit(items)
      .offset((page - 1) * items)
      .orderBy('person.first_name', 'ASC');

    if (search) {
      query
        .where('person.firstName LIKE :search', { search: `%${search}%` })
        .orWhere('person.lastName LIKE :search', { search: `%${search}%` });
    }

    const total = await query.getCount();

    const users = await query.getRawMany<UserInterface>();

    return { total, users };
  }
}
