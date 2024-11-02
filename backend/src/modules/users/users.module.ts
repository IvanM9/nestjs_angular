import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UsersService } from './domain/use-cases/users.service';
import { UsersRepository } from './infrastructure/persistence/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
