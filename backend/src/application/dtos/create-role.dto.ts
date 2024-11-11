import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  // @ApiProperty()
  // @IsString()
  // description: string;

  @IsArray()
  @IsNumber({}, { each: true })
  options: number[];
}
