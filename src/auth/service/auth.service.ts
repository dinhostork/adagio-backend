import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/security/encript.config';
import { IUsers } from 'src/users/IUsers';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: IUsers): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    const re = await bcrypt.compare(password, storedPasswordHash);
    return re;
  }
}
