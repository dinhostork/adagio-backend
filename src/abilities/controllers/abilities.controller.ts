import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
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
import { AddAbilityDto } from '../dtos/add-ability.dto';
import { AbilitiesService } from '../services/abilities.service';

@Controller('abilities')
export class AbilitiesController {
  constructor(private readonly abilityService: AbilitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() data: AddAbilityDto,
    @Request() req,
    @Res() res: Response,
  ) {
    data.title = this.captalize(data.title);

    const abilityExists =
      await this.abilityService.getByLoggedUserAndAbilityName(
        data.title,
        req.user,
      );

    if (abilityExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: STRINGS.ability_already_exists,
      });
    }
    const ability = await this.abilityService.add(data, req.user);
    ability.user = undefined;
    return res.status(HttpStatus.OK).json(ability);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getownAbilities(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('title', new DefaultValuePipe(null)) title = null,
  ) {
    return this.abilityService.getOwnAbilities(
      req.user,
      {
        page,
        limit,
      },
      title,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId')
  async getUserAbilities(
    @Param('userId') Userid: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('title', new DefaultValuePipe(null)) title = null,
  ) {
    return this.abilityService.getUsersAbilities(
      Userid,
      { page, limit },
      title,
    );
  }

  captalize(word: string) {
    return word.toLocaleLowerCase().charAt(0).toUpperCase() + word.slice(1);
  }
}
