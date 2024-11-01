import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/entities/user.entity';
import { Role } from './domain/entities/role.entity';
import { Option } from './domain/entities/option.entity';
import { RoleOptions } from './domain/entities/role-options.entity';
import { RoleUser } from './domain/entities/role-user.entity';
import { Session } from './domain/entities/session.entity';
import { AuthService } from './domain/use-cases/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controllers/auth.controller';

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
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
