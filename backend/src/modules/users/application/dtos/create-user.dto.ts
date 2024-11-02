import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(8, 20)
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]*$/, {
    message:
      'El nombre de usuario debe tener al menos una letra mayúscula y al menos un número, y no debe contener símbolos',
  })
  userName: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNumberString()
  @Length(10)
  @Matches(/^(?!.*(\d)\1{3}).*$/, {
    message: 'La identificación no debe tener el mismo número 4 veces seguidas',
  })
  identification: string;

  @ApiProperty({ type: Date })
  @IsDateString()
  birthDate: Date;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Matches(/^\S*$/, {
    message: 'La contraseña no debe contener espacios',
  })
  password: string;
}
