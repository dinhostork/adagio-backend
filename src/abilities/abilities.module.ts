import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';
import { AbilitiesComments } from './models/abilitycomments.entity';
import { AbilitiesVotes } from './models/abitlityvotes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Abilities, AbilitiesVotes, AbilitiesComments]),
  ],
})
export class AbilitiesModule {}
