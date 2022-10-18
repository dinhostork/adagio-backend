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
import { VoteTypes } from './votetypes.enum';

@Entity()
export class AbilitiesVotes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: VoteTypes,
    default: VoteTypes.POSITIVE,
  })
  type: VoteTypes;

  @ManyToOne(() => Abilities, (ability) => ability.votes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ability: Abilities;

  @ManyToOne(() => Users, (user) => user.votes)
  @JoinColumn()
  voter: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
