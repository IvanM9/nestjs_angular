import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'userName',
  'password',
]) {}

export class updateStatusDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
