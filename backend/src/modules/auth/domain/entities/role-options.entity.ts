import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Option } from './option.entity';

@Entity('role_options')
export class RoleOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'option_id' })
  optionId: number;

  @ManyToOne(() => Role, (role) => role.roleOptions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Option, (option) => option.roleOptions)
  @JoinColumn({ name: 'option_id' })
  option: Option;
}
