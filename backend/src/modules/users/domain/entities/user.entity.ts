import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './person.entity';
import { Session } from 'src/modules/auth/domain/entities/session.entity';
import { RoleUser } from 'src/modules/auth/domain/entities/role-user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name', unique: true, length: 20 })
  userName: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  status: boolean;

  @Column({ name: 'person_id' })
  personId: number;

  @OneToOne(() => Person, (person) => person.user)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => RoleUser, (roleUsers) => roleUsers.user)
  roleUsers: RoleUser[];
}
