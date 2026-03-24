import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  Nombre: string;

  @IsString({
    message: 'El apellido debe ser una cadena de texto',
  })
  Apellido: string;

  @IsString({
    message: 'El nombre de usuario debe ser una cadena de texto',
  })
  NombreUsuario: string;

  @IsEmail()
  Correo: string;

  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  Password: string;

  @IsString({
    message: 'La confirmación de la contraseña debe ser una cadena de texto',
  })
  ConfirmarPassword: string;

  @IsOptional()
  @IsString({
    message: 'El teléfono debe ser una cadena de texto',
  })
  Telefono?: string;

  @IsNumber()
  RolUsuario: number;
}
