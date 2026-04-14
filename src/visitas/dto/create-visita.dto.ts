import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateVisitaDto {
  @IsString({ message: 'El nombre del visitante debe ser una cadena de texto' })
  nombreVisitante: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;
}
