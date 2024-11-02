import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from '../../application/use-cases/users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import {
  updateStatusDto,
  UpdateUserDto,
} from '../../application/dtos/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('create')
  async create(@Body() data: CreateUserDto) {
    await this.service.create(data);

    return {
      message: 'User created',
    };
  }

  @Put('update/:id')
  async update(@Body() data: UpdateUserDto, @Param('id') id: number) {
    await this.service.update(id, data);

    return {
      message: 'User updated successfully',
    };
  }

  @Patch('update-status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() { status }: updateStatusDto,
  ) {
    await this.service.updateStatus(id, status);

    return {
      message: 'User status updated',
    };
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }
}
