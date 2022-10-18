import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import { UsersService } from './users.service';
import { Response } from 'express';
import STRINGS from '../constants/strings';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/security/encript.config';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/security/roles/role.enum';
import RolesGuard from 'src/security/roles/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body() userDto: CreateUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const userExists = await this.usersService.getByEmail(userDto.email);

    if (userExists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: STRINGS.existing_user_email });
    }

    const password_hash = await bcrypt.hash(userDto.password, saltOrRounds);

    const user = await this.usersService.create({
      name: userDto.name,
      email: userDto.email,
      password: password_hash,
      register_ip: req.ip,
      active: true,
      verified: false,
      admin: false,
    });

    user.password = undefined;

    return res.status(HttpStatus.OK).json(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard(Role.Admin))
  @Get()
  async getALL(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('name', new DefaultValuePipe(null)) name = null,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate(
      {
        page,
        limit,
      },
      name,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.usersService.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.usersService.deleteById(id);
  }
}
