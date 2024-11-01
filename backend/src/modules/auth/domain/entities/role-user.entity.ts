import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Entity('role_user')
export class RoleUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Role, (role) => role.roleUsers)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, (user) => user.roleUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
