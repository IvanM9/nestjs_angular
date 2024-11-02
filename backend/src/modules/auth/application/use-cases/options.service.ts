import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Option } from '../../domain/entities/option.entity';
import { CreateOptionDto } from '../dtos/create-option.dto';

@Injectable()
export class OptionsService {
  constructor(@InjectEntityManager() private cnx: EntityManager) {}

  async getOptions() {
    const options = await this.cnx.find(Option);
    return options;
  }

  async getOption(id: number) {
    const option = await this.cnx.findOneBy(Option, {
      id,
    });

    if (!option) {
      throw new BadRequestException('Opción no encontrada');
    }

    return option;
  }

  async createOption(option: CreateOptionDto) {
    const existingOption = await this.cnx.findOne(Option, {
      where: { name: option.name },
    });

    if (existingOption) {
      throw new BadRequestException('La opción ya existe');
    }

    const newOption = this.cnx.create(Option, {
      name: option.name,
    });

    await this.cnx.save(newOption).catch(() => {
      throw new BadRequestException('Error al crear la opción');
    });

    return newOption;
  }

  async update(id: number, option: CreateOptionDto) {
    const existingOption = await this.cnx.findOne(Option, {
      where: { id },
    });

    if (!existingOption) {
      throw new BadRequestException('Opción no encontrada');
    }

    existingOption.name = option.name;

    await this.cnx.save(existingOption).catch(() => {
      throw new BadRequestException('Error al actualizar la opción');
    });

    return existingOption;
  }

  async updateStatus(id: number, status: boolean) {
    const existingOption = await this.cnx.findOne(Option, {
      where: { id },
    });

    if (!existingOption) {
      throw new BadRequestException('Opción no encontrada');
    }

    existingOption.status = status;

    await this.cnx.save(existingOption).catch(() => {
      throw new BadRequestException(
        'Error al actualizar el estado de la opción',
      );
    });

    return existingOption;
  }
}
