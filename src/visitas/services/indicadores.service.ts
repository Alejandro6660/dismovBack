import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Visita, EstadoVisita } from '../entities/visita.entity';
import {
  IndicadoresEstadisticasDto,
  VisitasPorDiaDto,
  VisitanteFrecuenteDto,
  RatioConfirmadasDto,
  PromedioPorSemanaDto,
  Top10VisitantesDto,
} from '../dto/indicadores.dto';

@Injectable()
export class IndicadoresService {
  constructor(
    @InjectRepository(Visita)
    private visitaRepository: Repository<Visita>,
  ) {}

  /**
   * Obtiene el total de visitas con filtros opcionales
   */
  async getTotalVisitas(
    usuarioId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<IndicadoresEstadisticasDto> {
    const whereClause: any = {};

    if (usuarioId) {
      whereClause.usuarioId = usuarioId;
    }

    if (fechaInicio && fechaFin) {
      whereClause.fechaCreacion = Between(fechaInicio, fechaFin);
    }

    const total = await this.visitaRepository.count({ where: whereClause });

    const confirmadas = await this.visitaRepository.count({
      where: {
        ...whereClause,
        estado: EstadoVisita.CONFIRMADA,
      },
    });

    const pendientes = await this.visitaRepository.count({
      where: {
        ...whereClause,
        estado: EstadoVisita.PENDIENTE,
      },
    });

    return {
      total,
      confirmadas,
      pendientes,
    };
  }

  /**
   * Obtiene visitas agrupadas por día
   */
  async getVisitasPorDia(
    usuarioId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<VisitasPorDiaDto[]> {
    let query = this.visitaRepository
      .createQueryBuilder('v')
      .select('DATE(v.fechaCreacion) as fecha')
      .addSelect('COUNT(*) as total')
      .addSelect(
        `SUM(CASE WHEN v.estado = '${EstadoVisita.CONFIRMADA}' THEN 1 ELSE 0 END) as confirmadas`,
      )
      .addSelect(
        `SUM(CASE WHEN v.estado = '${EstadoVisita.PENDIENTE}' THEN 1 ELSE 0 END) as pendientes`,
      )
      .groupBy('DATE(v.fechaCreacion)')
      .orderBy('fecha', 'DESC');

    if (usuarioId) {
      query = query.where('v.usuarioId = :usuarioId', { usuarioId });
    }

    if (fechaInicio && fechaFin) {
      query = query.andWhere(
        'v.fechaCreacion BETWEEN :fechaInicio AND :fechaFin',
        {
          fechaInicio,
          fechaFin,
        },
      );
    }

    const result = await query.getRawMany();

    return result.map((row) => ({
      fecha: row.fecha,
      total: parseInt(row.total, 10),
      confirmadas: parseInt(row.confirmadas || 0, 10),
      pendientes: parseInt(row.pendientes || 0, 10),
    }));
  }

  /**
   * Obtiene visitantes marcados como frecuentes
   */
  async getVisitantesFrecuentes(
    usuarioId?: number,
  ): Promise<VisitanteFrecuenteDto[]> {
    let query = this.visitaRepository
      .createQueryBuilder('v')
      .select('v.id')
      .addSelect('v.nombreVisitante')
      .addSelect('v.telefono')
      .addSelect('v.email')
      .addSelect('COUNT(*) as totalVisitas')
      .addSelect('MAX(v.fechaCreacion) as ultimaVisita')
      .where('v.esFrecuente = true')
      .groupBy('v.nombreVisitante, v.email, v.telefono, v.id')
      .orderBy('totalVisitas', 'DESC');

    if (usuarioId) {
      query = query.andWhere('v.usuarioId = :usuarioId', { usuarioId });
    }

    const result = await query.getRawMany();

    return result.map((row) => ({
      id: row.v_id,
      nombreVisitante: row.v_nombreVisitante,
      telefono: row.v_telefono,
      email: row.v_email,
      totalVisitas: parseInt(row.totalVisitas, 10),
      ultimaVisita: row.ultimaVisita,
    }));
  }

  /**
   * Obtiene el ratio de visitas confirmadas vs pendientes
   */
  async getRatioConfirmadas(
    usuarioId?: number,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<RatioConfirmadasDto> {
    const whereClause: any = {};

    if (usuarioId) {
      whereClause.usuarioId = usuarioId;
    }

    if (fechaInicio && fechaFin) {
      whereClause.fechaCreacion = Between(fechaInicio, fechaFin);
    }

    const total = await this.visitaRepository.count({ where: whereClause });

    const confirmadas = await this.visitaRepository.count({
      where: {
        ...whereClause,
        estado: EstadoVisita.CONFIRMADA,
      },
    });

    const pendientes = total - confirmadas;
    const ratioConfirmacion = total > 0 ? (confirmadas / total) * 100 : 0;

    return {
      total,
      confirmadas,
      pendientes,
      ratioConfirmacion: parseFloat(ratioConfirmacion.toFixed(2)),
    };
  }

  /**
   * Obtiene el promedio de visitas por semana
   */
  async getPromedioPorSemana(
    usuarioId?: number,
  ): Promise<PromedioPorSemanaDto[]> {
    let query = this.visitaRepository
      .createQueryBuilder('v')
      .select(
        "TO_CHAR(DATE_TRUNC('week', v.fechaCreacion), 'YYYY-WW') as semana",
      )
      .addSelect('COUNT(*) as total')
      .groupBy("DATE_TRUNC('week', v.fechaCreacion)")
      .orderBy("DATE_TRUNC('week', v.fechaCreacion)", 'DESC');

    if (usuarioId) {
      query = query.where('v.usuarioId = :usuarioId', { usuarioId });
    }

    const result = await query.getRawMany();
    const weeks = result.length;

    return result.map((row) => ({
      semana: row.semana,
      total: parseInt(row.total, 10),
      promedio:
        weeks > 0
          ? parseFloat((parseInt(row.total, 10) / weeks).toFixed(2))
          : 0,
    }));
  }

  /**
   * Obtiene el top 10 de visitantes frecuentes
   */
  async getTop10VisitantesFrecuentes(
    usuarioId?: number,
  ): Promise<Top10VisitantesDto[]> {
    let query = this.visitaRepository
      .createQueryBuilder('v')
      .select('v.id')
      .addSelect('v.nombreVisitante')
      .addSelect('v.email')
      .addSelect('v.esFrecuente')
      .addSelect('COUNT(*) as totalVisitas')
      .addSelect('MAX(v.fechaCreacion) as ultimaVisita')
      .groupBy('v.nombreVisitante, v.email, v.id, v.esFrecuente')
      .orderBy('totalVisitas', 'DESC')
      .limit(10);

    if (usuarioId) {
      query = query.where('v.usuarioId = :usuarioId', { usuarioId });
    }

    const result = await query.getRawMany();

    return result.map((row) => ({
      id: row.v_id,
      nombreVisitante: row.v_nombreVisitante,
      email: row.v_email,
      totalVisitas: parseInt(row.totalVisitas, 10),
      ultimaVisita: row.ultimaVisita,
      esFrecuente: row.v_esFrecuente,
    }));
  }
}
