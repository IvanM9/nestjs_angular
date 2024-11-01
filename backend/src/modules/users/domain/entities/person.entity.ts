import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true, length: 10 })
  identification: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @OneToOne(() => User, (user) => user.person)
  user: User;
}
