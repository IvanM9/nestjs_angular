import 'reflect-metadata';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE } from '@config';
import { DataSource } from 'typeorm';
import { UserEntity } from '@entities/users.entity';
import { SessionEntity } from '@entities/session.entity';
import { RoleEntity } from '@entities/role.entity';
import { RoleUserEntity } from '@entities/role-user.entity';
import { RoleOptionsEntity } from '@entities/role-options.entity';
import { PersonEntity } from '@entities/person.entity';
import { OptionEntity } from '@entities/option.entity';

export const dbDataSource = new DataSource({
  type: 'postgres',
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST || 'localhost',
  port: Number(POSTGRES_PORT) || 5432,
  database: POSTGRES_DATABASE,
  synchronize: true,
  logging: true,
  entities: [UserEntity, SessionEntity, RoleEntity, RoleUserEntity, RoleOptionsEntity, PersonEntity, OptionEntity],
  // migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  // subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
  schema: 'public',
});
