import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';
import { AbilitiesComments } from './models/abilitycomments.entity';
import { AbilitiesVotes } from './models/abitlityvotes.entity';
import { AbilitiesController } from './controllers/abilities.controller';
import { AbilitiesService } from './services/abilities.service';
import { AbilitiesCommentsController } from './controllers/abilitiesComments.controller';
import { AbilitiesCommentsService } from './services/comments.service';
import { AbilitiesVotesService } from './services/votes.service';
import { AbilitiesVotesController } from './controllers/abilitiesVotes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Abilities, AbilitiesVotes, AbilitiesComments]),
  ],
  controllers: [
    AbilitiesController,
    AbilitiesCommentsController,
    AbilitiesVotesController,
  ],
  providers: [
    AbilitiesService,
    AbilitiesCommentsService,
    AbilitiesVotesService,
  ],
})
export class AbilitiesModule {}
