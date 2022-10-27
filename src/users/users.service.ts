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

  async getForLogin(id: number): Promise<Users | null> {
    const qb = await this.usersRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .addSelect('u.verified')
      .addSelect('u.active')
      .addSelect('u.register_ip')
      .addSelect('u.email')
      .where({ id })
      .getOne();

    return qb;
  }
  async getById(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async getProfileById(id: number): Promise<Users | null> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    const data = queryBuilder
      .leftJoinAndSelect(
        'users.abilities',
        'abilities',
        'users.id = abilities.userId',
      )
      .leftJoinAndMapMany(
        'abilities.positives',
        'abilities.votes',
        'positive_votes',
        `positive_votes.abilityId = abilities.id AND positive_votes.type = '${VoteTypes.POSITIVE}'`,
      )
      .leftJoinAndMapMany(
        'abilities.negatives',
        'abilities.votes',
        'negative_votes',
        `negative_votes.abilityId = abilities.id AND negative_votes.type = '${VoteTypes.NEGATIVE}'`,
      )
      .leftJoinAndMapMany(
        'negative_votes.voter',
        'negative_votes.voter',
        'negative_voter',
        `negative_votes.voter = negative_voter.id`,
      )
      .leftJoinAndMapMany(
        'positive_votes.voter',
        'positive_votes.voter',
        'positive_voter',
        `positive_votes.voter = positive_voter.id`,
      )
      .leftJoinAndMapMany(
        'abilities.comments',
        'abilities.comments',
        'comments',
        'abilities.id = comments.abilityId',
      )
      .leftJoinAndMapMany(
        'comments.author',
        'comments.author',
        'author',
        'comments.authorId = author.id',
      )
      .select([
        'users',
        'abilities',
        'positive_votes',
        'negative_votes',
        'negative_voter.id',
        'negative_voter.name',
        'positive_voter.id',
        'positive_voter.name',
        'comments',
        'author.id',
        'author.name',
      ])
      .where(`users.id=${id}`)
      .getOne();

    return data;
  }

  async getByEmail(email: string): Promise<Users | null> {
    const qb = await this.usersRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .addSelect('u.email')
      .where({ email })
      .getOne();

    return qb;
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
