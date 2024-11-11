import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleOptionsEntity } from '@entities/role-options.entity';
import { RoleUserEntity } from '@entities/role-user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => RoleOptionsEntity, roleOptions => roleOptions.role)
  roleOptions: RoleOptionsEntity[];

  @OneToMany(() => RoleUserEntity, roleUsers => roleUsers.role)
  roleUsers: RoleUserEntity[];
}
