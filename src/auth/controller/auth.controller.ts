import {
  Body,
  Controller,
  HttpException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import STRINGS from 'src/constants/strings';
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

    if (!user) throw new HttpException(STRINGS.user_not_found, 404);

    if (!(await this.authService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException(STRINGS.incorrect_password);
    }

    const token = await this.authService.generateJwt(user);
    user.password = undefined;

    return {
      user,
      token,
    };
  }
}
