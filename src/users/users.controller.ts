import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import STRINGS from '../constants/strings';
import { CreateUserDto } from './createUser.dto';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/security/encript.config';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
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

  @Get()
  async getALL() {
    return this.usersService.getAll();
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
