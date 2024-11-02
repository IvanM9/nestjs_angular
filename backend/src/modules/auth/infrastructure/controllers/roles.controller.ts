import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { RolesService } from '../../application/use-cases/roles.service';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async create(@Body() data: CreateRoleDto) {
    await this.rolesService.create(data);

    return { message: 'Role created successfully' };
  }

  @Put(':id')
  async update(@Body() data: CreateRoleDto, @Param('id') id: number) {
    await this.rolesService.update(id, data);

    return { message: 'Role updated successfully' };
  }

  @Patch(':id/:status')
  async updateStatus(
    @Param('id') id: number,
    @Param('status') status: boolean,
  ) {
    await this.rolesService.updateStatus(id, status);

    return { message: 'Role status updated successfully' };
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.rolesService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.rolesService.getAll();
  }
}
