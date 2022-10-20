import {
  Body,
  Controller,
  HttpStatus,
  Post,
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

  captalize(word: string) {
    return word.toLocaleLowerCase().charAt(0).toUpperCase() + word.slice(1);
  }
}
