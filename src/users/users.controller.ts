import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('register_ip') register_ip: string,
  ) {
    return this.usersService.create({
      name,
      email,
      password,
      register_ip,
      active: true,
      verified: false,
      admin: false,
    });
  }

  @Get()
  async getALL() {
    return this.usersService.getAll();
  }
}
