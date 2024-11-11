import { join } from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE } from '@/infrastructure/config';

export const dbConnection = async () => {
  const dbConfig: ConnectionOptions = {
    type: 'postgres',
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST || 'localhost',
    port: +POSTGRES_PORT || 5432,
    database: POSTGRES_DATABASE,
    synchronize: false,
    logging: false,
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
    subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  };

  await createConnection(dbConfig);
};
