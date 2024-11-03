import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../../application/use-cases/users.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportFromExcelDto } from '../../application/dtos/import-from-excel.dto';

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

  @Patch('update-status/:id/:status')
  async updateStatus(
    @Param('id') id: number,
    @Param('status', ParseBoolPipe) status: boolean,
  ) {
    await this.service.updateStatus(id, status);

    return {
      message: 'User status updated',
    };
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: number) {
    return {
      data: await this.service.getById(id),
    };
  }

  @Get('all')
  async getAll() {
    return {
      data: await this.service.getAllUsers(),
    };
  }

  @Post('import-from-excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImportFromExcelDto,
  })
  async importFromExcel(@UploadedFile() file: Express.Multer.File) {
    await this.service.importFromExcel(file);

    return {
      message: 'Users imported successfully',
    };
  }
}
