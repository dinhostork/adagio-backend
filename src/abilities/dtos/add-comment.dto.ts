import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ description: 'É preciso informar o comentário' })
  @IsNotEmpty()
  comment: string;
}
