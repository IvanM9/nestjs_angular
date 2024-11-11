import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@entities/users.entity';

@Entity('persons')
export class PersonEntity {
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

  @OneToOne(() => UserEntity, user => user.person)
  user: UserEntity;
}
