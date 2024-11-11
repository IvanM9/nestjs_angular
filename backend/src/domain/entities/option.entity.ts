import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleOptionsEntity } from '@entities/role-options.entity';

@Entity('options')
export class OptionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => RoleOptionsEntity, roleOptions => roleOptions.option)
  roleOptions: RoleOptionsEntity[];
}
