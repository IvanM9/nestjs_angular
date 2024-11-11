import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
