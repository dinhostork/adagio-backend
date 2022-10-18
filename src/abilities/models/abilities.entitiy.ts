import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Abilities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column([{ nullable: true }])
  video_url: string;

  @Column('boolean')
  can_comment: boolean;

  @ManyToOne(() => Users, (user) => user.abilities, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
