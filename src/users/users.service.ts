import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsers } from './IUsers';
import { Users } from './users.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
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

  async getByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async deleteById(id: number): Promise<any> {
    return this.usersRepository.delete({ id });
  }

  paginate(options: IPaginationOptions): Promise<Pagination<Users>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.id', 'DESC');

    return paginate<Users>(queryBuilder, options);
  }
}
