import { EntityManager } from 'typeorm';
import { UserEntity } from '@/domain/entities/users.entity';
import { UserInterface } from '@/domain/interfaces/users.interface';

export class UsersRepository {
  async getAllUsers(cnx: EntityManager, search: string, page = 1, items = 5) {
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
      .from(UserEntity, 'user')
      .leftJoinAndSelect('user.person', 'person')
      .limit(items)
      .offset((page - 1) * items)
      .orderBy('person.first_name', 'ASC');

    if (search) {
      query.where('person.firstName LIKE :search', { search: `%${search}%` }).orWhere('person.lastName LIKE :search', { search: `%${search}%` });
    }

    const total = await query.getCount();

    const users = await query.getRawMany<UserInterface>();

    return { total, users };
  }
}
