import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsers } from './IUsers';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(data: IUsers): Promise<Users> {
    return this.usersRepository.save(data);
  }

  async getAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async getById(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<any> {
    return this.usersRepository.delete({ id });
  }
}
