import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddAbilityDto {
  @ApiProperty({ description: 'É preciso informar o nome da habilidade' })
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  video_url: string;

  @ApiProperty({ description: 'Habilita os comentários da habilidade' })
  @IsNotEmpty()
  can_comment: boolean;
}
