import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  Nombre?: string;
  Apellido?: string;
  NombreUsuario?: string;
  Correo?: string;
  Password?: string;
  ConfirmarPassword?: string;
  Telefono?: string;
  RolUsuario?: number;
}
