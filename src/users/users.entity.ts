import { Abilities } from 'src/abilities/models/abilities.entitiy';
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

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  admin: boolean;

  @Column()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
