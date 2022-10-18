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
import { AbilitiesVotes } from 'src/abilities/models/abitlityvotes.entity';
import { VoteTypes } from 'src/abilities/models/votetypes.enum';
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
    const queryBuilder = await this.usersRepository.createQueryBuilder('users');
    const data = queryBuilder
      .leftJoinAndSelect(
        'users.abilities',
        'abilities',
        'users.id = abilities.userId',
      )
      .leftJoinAndMapMany(
        'abilities.positives',
        'abilities.votes',
        'votes',
        `votes.abilityId = abilities.id AND votes.type = '${VoteTypes.POSITIVE}'`,
      )
      .leftJoinAndMapMany(
        'abilities.negatives',
        'abilities.votes',
        'negative_votes',
        `negative_votes.abilityId = abilities.id AND negative_votes.type = '${VoteTypes.NEGATIVE}'`,
      )
      .where(`users.id=${id}`)
      .getOne();

    return data;
  }

  async getByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async deleteById(id: number): Promise<any> {
    return this.usersRepository.delete({ id });
  }

  paginate(
    options: IPaginationOptions,
    name?: string,
  ): Promise<Pagination<Users>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    if (name) {
      queryBuilder.where('users.name LIKE :s', { s: `%${name}%` });
    }
    queryBuilder.orderBy('users.name', 'DESC');

    return paginate<Users>(queryBuilder, options);
  }
}
