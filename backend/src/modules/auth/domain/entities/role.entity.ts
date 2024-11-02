import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleOptions } from './role-options.entity';
import { RoleUser } from './role-user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => RoleOptions, (roleOptions) => roleOptions.role)
  roleOptions: RoleOptions[];

  @OneToMany(() => RoleUser, (roleUsers) => roleUsers.role)
  roleUsers: RoleUser[];
}
