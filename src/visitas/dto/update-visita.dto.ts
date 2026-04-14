import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateVisitaDto {
  @IsOptional()
  @IsBoolean({ message: 'esFrecuente debe ser un valor booleano' })
  esFrecuente?: boolean;
}
