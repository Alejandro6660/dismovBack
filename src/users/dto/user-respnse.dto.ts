import { Expose } from 'class-transformer';

export class UserResponseDto {
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    nombreUsuario: string,
    email: string,
    estaActivo: boolean,
    telefono?: string,
  ) {
    this.id = id;
    this.Nombre = nombre;
    this.Apellido = apellido;
    this.NombreUsuario = nombreUsuario;
    this.Email = email;
    this.Telefono = telefono;
    this.EstaActivo = estaActivo;
  }

  id: number;

  Nombre: string;

  Apellido: string;

  NombreUsuario: string;

  Email: string;

  Telefono?: string;

  EstaActivo: boolean;
}
