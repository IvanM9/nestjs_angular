import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UsersService } from './application/use-cases/users.service';
import { UsersRepository } from './infrastructure/persistence/users.repository';
import { UserRolesService } from './domain/services/user-roles.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserRolesService],
  exports: [UsersService],
})
export class UsersModule {}
