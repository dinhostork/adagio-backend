import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Abilities } from './abilities.entitiy';

@Entity()
export class AbilitiesComments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @ManyToOne(() => Abilities, (ability) => ability.votes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ability: Abilities;

  @ManyToOne(() => Users, (user) => user.comments)
  @JoinColumn()
  author: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
