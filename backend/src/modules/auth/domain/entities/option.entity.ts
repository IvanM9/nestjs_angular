import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleOptions } from './role-options.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RoleOptions, (roleOptions) => roleOptions.option)
  roleOptions: RoleOptions[];
}
