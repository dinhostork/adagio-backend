import {
  Body,
  Controller,
  HttpException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from '../dtos/login.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.getByEmail(email);

    if (!user) throw new HttpException('Usuário não encontrado', 404);

    if (!(await this.authService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const token = await this.authService.generateJwt(user);
    user.password = undefined;

    return {
      user,
      token,
    };
  }
}
