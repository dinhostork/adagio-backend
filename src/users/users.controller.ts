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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import STRINGS from '../constants/strings';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const userExists = await this.usersService.getByEmail(email);

    if (userExists) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: STRINGS.existing_user_email });
    }

    return this.usersService.create({
      name,
      email,
      password,
      register_ip: req.ip,
      active: true,
      verified: false,
      admin: false,
    });
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
