import { Abilities } from 'src/abilities/models/abilities.entitiy';
import { AbilitiesComments } from 'src/abilities/models/abilitycomments.entity';
import { AbilitiesVotes } from 'src/abilities/models/abitlityvotes.entity';
import { Role } from 'src/security/roles/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false, select: false })
  verified: boolean;

  @Column({ default: true, select: false })
  active: boolean;

  @Column({ default: true, select: false })
  admin: boolean;

  @Column({ select: false })
  register_ip: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  roles: Role;

  @OneToMany(() => Abilities, (abilities) => abilities.user)
  @JoinTable()
  abilities: [];

  @OneToMany(() => AbilitiesVotes, (votes) => votes.voter)
  @JoinTable()
  votes: [];

  @OneToMany(() => AbilitiesComments, (comments) => comments.author)
  @JoinTable()
  comments: [];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
