import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, Entity } from 'typeorm';
import { PersonEntity } from '@entities/person.entity';
import { SessionEntity } from '@entities/session.entity';
import { RoleUserEntity } from '@entities/role-user.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column({default: false})
  logged: boolean

  @Column({ name: 'person_id' })
  personId: number;

  @OneToOne(() => PersonEntity)
  @JoinColumn({ name: 'person_id'})
  person: PersonEntity;

  @OneToMany(() => SessionEntity, session => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => RoleUserEntity, roleUsers => roleUsers.user)
  roleUsers: RoleUserEntity[];
}
