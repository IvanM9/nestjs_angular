import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
