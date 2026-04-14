export class CrearAvisoDto {
  titulo: string;
  descripcion: string;
}

export class CrearPublicacionDTO {}

// Alias para compatibilidad con el controlador
export class CreateInteraccioneDto extends CrearAvisoDto {}
