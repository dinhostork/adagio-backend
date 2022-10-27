import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abilities } from './models/abilities.entitiy';
import { AbilitiesComments } from './models/abilitycomments.entity';
import { AbilitiesVotes } from './models/abitlityvotes.entity';
import { AbilitiesController } from './controllers/abilities.controller';
import { AbilitiesService } from './services/abilities.service';
import { AbilitiesCommentsController } from './controllers/abilitiesComments.controller';
import { AbilitiesCommentsService } from './services/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Abilities, AbilitiesVotes, AbilitiesComments]),
  ],
  controllers: [AbilitiesController, AbilitiesCommentsController],
  providers: [AbilitiesService, AbilitiesCommentsService],
})
export class AbilitiesModule {}
