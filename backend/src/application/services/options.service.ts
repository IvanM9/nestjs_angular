import { EntityManager } from 'typeorm';
import { CreateOptionDto } from '@dtos/create-option.dto';
import { Service } from 'typedi';
import { OptionEntity } from '@entities/option.entity';
import { HttpException } from '@exceptions/HttpException';
import { dbDataSource } from '@database';

@Service()
export class OptionsService {
  cnx: EntityManager;
  constructor() {
    this.cnx = dbDataSource.manager;
  }

  async getOptions() {
    const options = await this.cnx.find(OptionEntity);
    return options;
  }

  async getOption(id: number) {
    const option = await this.cnx.findOne(OptionEntity, {
      where: { id },
    });

    if (!option) {
      throw new HttpException(400, 'Opción no encontrada');
    }

    return option;
  }

  async createOption(option: CreateOptionDto) {
    const existingOption = await this.cnx.findOne(OptionEntity, {
      where: { name: option.name },
    });

    if (existingOption) {
      throw new HttpException(400, 'La opción ya existe');
    }

    const newOption = this.cnx.create(OptionEntity, {
      name: option.name,
    });

    await this.cnx.save(newOption).catch(() => {
      throw new HttpException(400, 'Error al crear la opción');
    });

    return newOption;
  }

  async update(id: number, option: CreateOptionDto) {
    const existingOption = await this.cnx.findOne(OptionEntity, {
      where: { id },
    });

    if (!existingOption) {
      throw new HttpException(400, 'Opción no encontrada');
    }

    existingOption.name = option.name;

    await this.cnx.save(existingOption).catch(() => {
      throw new HttpException(400, 'Error al actualizar la opción');
    });

    return existingOption;
  }

  async updateStatus(id: number, status: boolean) {
    const existingOption = await this.cnx.findOne(OptionEntity, {
      where: { id },
    });

    if (!existingOption) {
      throw new HttpException(400, 'Opción no encontrada');
    }

    existingOption.status = status;

    await this.cnx.save(existingOption).catch(() => {
      throw new HttpException(400, 'Error al actualizar el estado de la opción');
    });

    return existingOption;
  }
}
