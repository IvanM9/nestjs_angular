import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { User } from '../../domain/entities/user.entity';

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
}
