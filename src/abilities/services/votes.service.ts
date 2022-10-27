import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import STRINGS from 'src/constants/strings';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Abilities } from '../models/abilities.entitiy';
import { AbilitiesVotes } from '../models/abitlityvotes.entity';
import { VoteTypes } from '../models/votetypes.enum';
import { AbilitiesService } from './abilities.service';

@Injectable()
export class AbilitiesVotesService {
  constructor(
    @InjectRepository(AbilitiesVotes)
    private readonly abilitiesVotesRepository: Repository<AbilitiesVotes>,
    private readonly abilityService: AbilitiesService,
  ) {}

  getByUserAbility(ability: Abilities, voter: Users): Promise<AbilitiesVotes> {
    const qb = this.abilitiesVotesRepository
      .createQueryBuilder('votes')
      .where(`abilityId = ${ability.id} AND voterId = ${voter.id}`)
      .select()
      .getOne();

    return qb;
  }

  async removeVoteByUserAndAbility(
    idAbility: number,
    user: Users,
  ): Promise<void> {
    await this.abilitiesVotesRepository
      .createQueryBuilder('votes')
      .delete()
      .from(AbilitiesVotes)
      .where(`abilityId = ${idAbility} AND voterId = ${user.id}`)
      .execute();
  }

  async vote(
    idAbility: number,
    user: Users,
    type: VoteTypes,
  ): Promise<AbilitiesVotes> {
    const ability = await this.abilityService.getById(idAbility);
    if (!ability) throw new NotFoundException(STRINGS.ability_not_found);

    const voteAlreadyExists = await this.getByUserAbility(ability, user);

    if (voteAlreadyExists) {
      await this.abilitiesVotesRepository.save({
        id: voteAlreadyExists.id,
        type,
      });

      voteAlreadyExists.type = type;
      return voteAlreadyExists;
    }

    const vote = await this.abilitiesVotesRepository.save({
      voter: user,
      type,
      ability,
    });

    vote.voter.password = undefined;
    vote.voter.register_ip = undefined;

    return vote;
  }

  async votePositive(idAbility: number, user: Users): Promise<AbilitiesVotes> {
    return this.vote(idAbility, user, VoteTypes.POSITIVE);
  }

  async voteNegative(idAbility: number, user: Users): Promise<AbilitiesVotes> {
    return this.vote(idAbility, user, VoteTypes.NEGATIVE);
  }
}
