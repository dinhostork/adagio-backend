import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { AbilitiesComments } from './abilitycomments.entity';
import { AbilitiesVotes } from './abitlityvotes.entity';

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

  @OneToMany(() => AbilitiesVotes, (votes) => votes.ability)
  @JoinTable()
  votes: [];

  @OneToMany(() => AbilitiesComments, (commets) => commets.ability)
  @JoinTable()
  comments: [];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
