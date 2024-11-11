import { IsString, Matches, Length, IsNumberString, IsDateString, IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @Length(8, 20, {
    message: 'El nombre de usuario debe tener entre 8 y 20 caracteres',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]*$/, {
    message: 'El nombre de usuario debe tener al menos una letra mayúscula y al menos un número, y no debe contener símbolos',
  })
  userName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  @Length(10)
  @Matches(/^(?!.*(\d)\1{3}).*$/, {
    message: 'La identificación no debe tener el mismo número 4 veces seguidas',
  })
  identification: string;

  @IsDateString()
  birthDate: Date;

  // @IsStrongPassword(
  //   {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minUppercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //   },
  //   {
  //     message: 'La contraseña debe tener al menos 8 caracteres, una letra minúscula, una letra mayúscula, un número y un símbolo',
  //   },
  // )
  @Matches(/^\S*$/, {
    message: 'La contraseña no debe contener espacios',
  })
  password: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  rolesId: number[];
}

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumberString()
  @Length(10)
  @Matches(/^(?!.*(\d)\1{3}).*$/, {
    message: 'La identificación no debe tener el mismo número 4 veces seguidas',
  })
  identification: string;

  @IsDateString()
  birthDate: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  rolesId: number[];
}

export class updateStatusDto {
  @IsBoolean()
  status: boolean;
}
