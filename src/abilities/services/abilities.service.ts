import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { AddAbilityDto } from '../dtos/add-ability.dto';
import { Abilities } from '../models/abilities.entitiy';
import { VoteTypes } from '../models/votetypes.enum';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
@Injectable()
export class AbilitiesService {
  constructor(
    @InjectRepository(Abilities)
    private readonly abilityRepository: Repository<Abilities>,
  ) {}

  async add(data: AddAbilityDto, user: Users) {
    return this.abilityRepository.save({
      ...data,
      title:
        data.title.toLocaleLowerCase().charAt(0).toUpperCase() +
        data.title.slice(1),
      user: user,
    });
  }

  async getById(id: number) {
    return this.abilityRepository.findOneBy({ id });
  }

  async getByLoggedUserAndAbilityName(title: string, user: Users) {
    const data = this.abilityRepository
      .createQueryBuilder('a')
      .where(`title = '${title}' AND userId = ${user.id}`)
      .select()
      .getOne();

    return data;
  }

  getOwnAbilities(
    user: Users,
    options: IPaginationOptions,
    title: string,
  ): Promise<Pagination<Abilities>> {
    const queryBuilder = this.abilityRepository.createQueryBuilder('abilities');
    const data = queryBuilder
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
      .where(`userId=${user.id}`);

    if (title) {
      data.where(`userId=${user.id} AND abilities.title LIKE :s`, {
        s: `%${title}%`,
      });
    }

    return paginate<Abilities>(data, options);
  }

  getUsersAbilities(
    userId: number,
    options: IPaginationOptions,
    title: string,
  ): Promise<Pagination<Abilities>> {
    const data = this.abilityRepository
      .createQueryBuilder('abilities')
      .where({ user: userId })
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
      );

    if (title) {
      data.where(`userId = ${userId} AND abilities.title LIKE :s`, {
        s: `%${title}%`,
      });
    }

    return paginate<Abilities>(data, options);
  }

  async deleteById(id: number, user: Users) {
    await this.abilityRepository
      .createQueryBuilder('ab')
      .delete()
      .from('abilities')
      .where(`id = ${id} AND userId = ${user.id}`)
      .execute();
  }
}
