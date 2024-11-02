import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { OptionsService } from '../../application/use-cases/options.service';
import { CreateOptionDto } from '../../application/dtos/create-option.dto';

@Controller('options')
export class OptionsController {
  constructor(private service: OptionsService) {}

  @Get()
  async getOptions() {
    return {
      data: await this.service.getOptions(),
    };
  }

  @Post()
  async createOption(@Body() option: CreateOptionDto) {
    await this.service.createOption(option);

    return {
      message: 'Option created successfully',
    };
  }

  @Get(':id')
  async getOption(@Param('id') id: number) {
    return {
      data: await this.service.getOption(id),
    };
  }

  @Put(':id')
  async updateOption(@Param('id') id: number, @Body() option: CreateOptionDto) {
    await this.service.update(id, option);

    return {
      message: 'Option updated successfully',
    };
  }

  @Patch(':id/:status')
  async updateStatus(
    @Param('id') id: number,
    @Param('status', ParseBoolPipe) status: boolean,
  ) {
    await this.service.updateStatus(id, status);

    return {
      message: 'Option status updated successfully',
    };
  }
}
