import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';
import { AbilitiesComments } from './models/abilitycomments.entity';
import { AbilitiesVotes } from './models/abitlityvotes.entity';
import { AbilitiesController } from './controllers/abilities.controller';
import { AbilitiesService } from './services/abilities.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Abilities, AbilitiesVotes, AbilitiesComments]),
  ],
  controllers: [AbilitiesController],
  providers: [AbilitiesService],
})
export class AbilitiesModule {}
