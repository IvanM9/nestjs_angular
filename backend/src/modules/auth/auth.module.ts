import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/entities/user.entity';
import { Role } from './domain/entities/role.entity';
import { Option } from './domain/entities/option.entity';
import { RoleOptions } from './domain/entities/role-options.entity';
import { RoleUser } from './domain/entities/role-user.entity';
import { Session } from './domain/entities/session.entity';
import { AuthService } from './application/use-cases/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { RolesService } from './application/use-cases/roles.service';
import { RolesController } from './infrastructure/controllers/roles.controller';
import { SessionsService } from './application/use-cases/sessions.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './application/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Option,
      RoleOptions,
      RoleUser,
      Session,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('environment.jwtSecret'),
        global: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [AuthService, RolesService, SessionsService, JwtStrategy],
  controllers: [AuthController, RolesController],
  exports: [RolesService],
})
export class AuthModule {}
