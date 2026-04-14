import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  Nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  Apellido: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  NombreUsuario: string;

  @IsEmail()
  Email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain letters and numbers',
  })
  Password: string;

  @IsString()
  Telefono: string;
}
