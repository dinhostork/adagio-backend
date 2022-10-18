import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';
import { AbilitiesVotes } from './models/abitlityvotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Abilities, AbilitiesVotes])],
})
export class AbilitiesModule {}
