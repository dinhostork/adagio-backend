import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { AddAbilityDto } from '../dtos/add-ability.dto';
import { Abilities } from '../models/abilities.entitiy';

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

  async getByLoggedUserAndAbilityName(title: string, user: Users) {
    const data = this.abilityRepository
      .createQueryBuilder('a')
      .where(`title = '${title}' AND userId = ${user.id}`)
      .select()
      .getOne();

    return data;
  }
}
