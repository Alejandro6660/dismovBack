export class IndicadoresEstadisticasDto {
  total: number;
  pendientes: number;
  confirmadas: number;
}

export class VisitasPorDiaDto {
  fecha: string;
  total: number;
  confirmadas: number;
  pendientes: number;
}

export class VisitanteFrecuenteDto {
  id: number;
  nombreVisitante: string;
  telefono: string;
  email: string;
  totalVisitas: number;
  ultimaVisita: Date;
}

export class RatioConfirmadasDto {
  total: number;
  confirmadas: number;
  pendientes: number;
  ratioConfirmacion: number;
}

export class PromedioPorSemanaDto {
  semana: string;
  promedio: number;
  total: number;
}

export class Top10VisitantesDto {
  id: number;
  nombreVisitante: string;
  email: string;
  totalVisitas: number;
  ultimaVisita: Date;
  esFrecuente: boolean;
}
