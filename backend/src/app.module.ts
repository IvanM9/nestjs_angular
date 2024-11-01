import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envConfig from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/domain/entities/user.entity';
import { Person } from './modules/users/domain/entities/person.entity';
import { Role } from './modules/auth/domain/entities/role.entity';
import { Option } from './modules/auth/domain/entities/option.entity';
import { RoleOptions } from './modules/auth/domain/entities/role-options.entity';
import { RoleUser } from './modules/auth/domain/entities/role-user.entity';
import { Session } from './modules/auth/domain/entities/session.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        entities: [User, Person, Role, Option, RoleOptions, RoleUser, Session],
        synchronize: true,
        host: config.get('environment.database.host'),
        port: config.get('environment.database.port'),
        username: config.get('environment.database.username'),
        password: config.get('environment.database.password'),
        database: config.get('environment.database.name'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
