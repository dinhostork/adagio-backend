import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Request() req,
  ) {
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
