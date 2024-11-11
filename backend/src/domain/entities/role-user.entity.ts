import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '@entities/role.entity';
import { UserEntity } from '@entities/users.entity';

@Entity('role_user')
export class RoleUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => RoleEntity, role => role.roleUsers)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => UserEntity, user => user.roleUsers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
