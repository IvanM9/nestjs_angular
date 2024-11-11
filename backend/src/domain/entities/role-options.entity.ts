import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '@entities/role.entity';
import { OptionEntity } from '@entities/option.entity';

@Entity('role_options')
export class RoleOptionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => RoleEntity, role => role.roleOptions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => OptionEntity, option => option.roleOptions)
  @JoinColumn({ name: 'option_id' })
  option: OptionEntity;
}
