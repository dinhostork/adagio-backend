import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ default: true })
  admin: boolean;

  @Column()
  register_ip: string;
}