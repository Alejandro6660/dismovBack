import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoVisita } from '../entities/visita.entity';

export class QueryVisitaDto {
  @IsOptional()
  @Type(() => Date)
  fechaInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  fechaFin?: Date;

  @IsOptional()
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  estado?: EstadoVisita;

  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  take?: number = 10;
}
