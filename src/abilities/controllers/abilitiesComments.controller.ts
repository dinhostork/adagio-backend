import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import STRINGS from 'src/constants/strings';
import { Users } from 'src/users/users.entity';
import { AddCommentDto } from '../dtos/add-comment.dto';
import { AbilitiesService } from '../services/abilities.service';
import { AbilitiesCommentsService } from '../services/comments.service';

@Controller('abilities')
export class AbilitiesCommentsController {
  constructor(
    private readonly abilityService: AbilitiesService,
    private readonly commentsService: AbilitiesCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:abilityId/comment')
  async create(
    @Body() data: AddCommentDto,
    @Request() req,
    @Param('abilityId') abilityId: number,
    @Res() res: Response,
  ) {
    const user = req.user as unknown as Users;

    const abilityExists = await this.abilityService.getById(abilityId);
    if (!abilityExists) throw new NotFoundException(STRINGS.ability_not_found);

    if (!abilityExists.can_comment)
      throw new BadRequestException(STRINGS.ability_not_commentable);

    if (!user.verified)
      throw new BadRequestException(
        `${STRINGS.user_can_not_comment}! ${STRINGS.user_not_verified}`,
      );

    if (!user.active)
      throw new BadRequestException(
        `${STRINGS.user_can_not_comment}! ${STRINGS.user_banned}`,
      );

    const comment = await this.commentsService.add(data, user, abilityExists);
    return res.status(HttpStatus.OK).json(comment);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:abilityId/comments')
  getByablities(
    @Request() req,
    @Param('abilityId') abilityId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const user = req.user as unknown as Users;
    return this.commentsService.getByAbilities(
      abilityId,
      { page, limit },
      user,
    );
  }
}
