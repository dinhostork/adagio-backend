import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Users } from 'src/users/users.entity';
import { AbilitiesVotesService } from '../services/votes.service';

@Controller('abilities')
export class AbilitiesVotesController {
  constructor(private readonly votesService: AbilitiesVotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:abilityId/vote-up')
  async votePositive(@Request() req, @Param('abilityId') abilityId: number) {
    const user = req.user as unknown as Users;
    return this.votesService.votePositive(abilityId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:abilityId/vote-down')
  async voteNegative(@Request() req, @Param('abilityId') abilityId: number) {
    const user = req.user as unknown as Users;
    return this.votesService.voteNegative(abilityId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:abilityId/vote')
  async removeVote(@Request() req, @Param('abilityId') abilityId: number) {
    const user = req.user as unknown as Users;
    return this.votesService.removeVoteByUserAndAbility(abilityId, user);
  }
}
