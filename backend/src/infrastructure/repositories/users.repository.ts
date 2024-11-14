import { EntityManager } from 'typeorm';
import { UserEntity } from '@/domain/entities/users.entity';
import { UserInterface } from '@/domain/interfaces/users.interface';
import { Service } from 'typedi';

@Service()
export class UsersRepository {
    async getAllUsers(cnx: EntityManager, search: string, page = 1, items = 5) {
      const result = await cnx.query(
          `SELECT * FROM get_all_users($1, $2, $3)`,
          [search ?? '', page, items]
      ).catch((error) => {
          console.error(error);
          return [];
      });

      const total = result.length > 0 ? result[0].total : 0;
      const users: UserInterface = result.map(row => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          identification: row.identification,
          birthDate: row.birthDate,
          status: row.status,
          userName: row.userName,
          email: row.email,
          logged: row.logged
      }));
  
      return { total, users };
  }
}
