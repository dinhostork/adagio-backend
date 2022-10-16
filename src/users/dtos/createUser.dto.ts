import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'É preciso informar um nome' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    minimum: 8,
    description: 'A senha precisa ter pelo menos 8 caracteres',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
