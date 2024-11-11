import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@entities/users.entity';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_date', type: 'timestamp with time zone' })
  firstDate: Date;

  @Column({
    name: 'last_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastDate: Date;

  @Column()
  logged: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, user => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
