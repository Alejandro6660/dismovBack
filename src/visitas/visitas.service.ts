import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { QueryVisitaDto } from './dto/query-visita.dto';
import { Visita, EstadoVisita } from './entities/visita.entity';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private visitaRepository: Repository<Visita>,
  ) {}

  /**
   * Crea una nueva visita con estado PENDIENTE y devuelve datos para generar QR
   */
  async create(
    createVisitaDto: CreateVisitaDto,
    usuarioId: number,
  ): Promise<{ id: number; datoQR: string; visitante: string }> {
    const nuevaVisita = this.visitaRepository.create({
      ...createVisitaDto,
      estado: EstadoVisita.PENDIENTE,
      usuarioId,
    });

    const visitaGuardada = await this.visitaRepository.save(nuevaVisita);

    // Generar datos para QR: id + usuarioId + timestamp
    const datosQR = {
      visitaId: visitaGuardada.id,
      usuarioId,
      timestamp: new Date().getTime(),
    };

    const datoQRBase64 = Buffer.from(JSON.stringify(datosQR)).toString(
      'base64',
    );

    return {
      id: visitaGuardada.id,
      datoQR: datoQRBase64,
      visitante: visitaGuardada.nombreVisitante,
    };
  }

  /**
   * Obtiene todas las visitas con filtros opcionales
   */
  async findAll(query: QueryVisitaDto): Promise<{
    data: Visita[];
    total: number;
    skip: number;
    take: number;
  }> {
    const { fechaInicio, fechaFin, usuarioId, estado, skip, take } = query;

    const whereClause: any = {};

    if (usuarioId) {
      whereClause.usuarioId = usuarioId;
    }

    if (estado) {
      whereClause.estado = estado;
    }

    if (fechaInicio && fechaFin) {
      whereClause.fechaCreacion = Between(fechaInicio, fechaFin);
    }

    const [data, total] = await this.visitaRepository.findAndCount({
      where: whereClause,
      order: { fechaCreacion: 'DESC' },
      skip: skip || 0,
      take: take || 10,
      relations: ['usuarioCreador'],
    });

    return {
      data,
      total,
      skip: skip || 0,
      take: take || 10,
    };
  }

  /**
   * Obtiene una visita por ID
   */
  async findOne(id: number): Promise<Visita> {
    const visita = await this.visitaRepository.findOne({
      where: { id },
      relations: ['usuarioCreador'],
    });

    if (!visita) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }

    return visita;
  }

  /**
   * Actualiza una visita (solo esFrecuente)
   */
  async update(id: number, updateVisitaDto: UpdateVisitaDto): Promise<Visita> {
    const visita = await this.findOne(id);

    if (updateVisitaDto.esFrecuente !== undefined) {
      visita.esFrecuente = updateVisitaDto.esFrecuente;
    }

    return await this.visitaRepository.save(visita);
  }

  /**
   * Elimina una visita
   */
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.visitaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Visita con ID ${id} no encontrada`);
    }

    return { message: `Visita ${id} eliminada correctamente` };
  }

  /**
   * Confirma una visita al escanear el QR
   * Decodifica los datos del QR y crea un nuevo registro de tipo CONFIRMADA
   */
  async confirmarVisita(datoQRBase64: string): Promise<{
    id: number;
    mensaje: string;
    visitante: string;
  }> {
    try {
      // Decodificar datos del QR
      const datosQRString = Buffer.from(datoQRBase64, 'base64').toString(
        'utf-8',
      );
      const datosQR = JSON.parse(datosQRString);

      const { visitaId, usuarioId, timestamp } = datosQR;

      // Validar timestamp (opcional: si no está expirado)
      const ahora = new Date().getTime();
      const diferenciaMs = ahora - timestamp;
      // Permitir QRs de hace hasta 24 horas
      if (diferenciaMs > 24 * 60 * 60 * 1000) {
        throw new BadRequestException('El código QR ha expirado');
      }

      // Obtener la visita original
      const visitaOriginal = await this.visitaRepository.findOne({
        where: { id: visitaId, usuarioId },
      });

      if (!visitaOriginal) {
        throw new NotFoundException(
          'No se encontró la visita correspondiente al código QR',
        );
      }

      // Crear nuevo registro de visita confirmada
      const visitaConfirmada = this.visitaRepository.create({
        nombreVisitante: visitaOriginal.nombreVisitante,
        telefono: visitaOriginal.telefono,
        email: visitaOriginal.email,
        estado: EstadoVisita.CONFIRMADA,
        esFrecuente: visitaOriginal.esFrecuente,
        fechaConfirmacion: new Date(),
        usuarioId,
      });

      const visitaGuardada = await this.visitaRepository.save(visitaConfirmada);

      return {
        id: visitaGuardada.id,
        mensaje: 'Visita confirmada correctamente',
        visitante: visitaGuardada.nombreVisitante,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Error al procesar el código QR');
    }
  }

  /**
   * Devuelve los datos del QR para una visita pendiente
   */
  async generarDatosQR(visitaId: number): Promise<{ datoQR: string }> {
    const visita = await this.findOne(visitaId);

    if (visita.estado !== EstadoVisita.PENDIENTE) {
      throw new BadRequestException(
        'Solo se puede generar QR para visitas en estado PENDIENTE',
      );
    }

    const datosQR = {
      visitaId: visita.id,
      usuarioId: visita.usuarioId,
      timestamp: new Date().getTime(),
    };

    const datoQRBase64 = Buffer.from(JSON.stringify(datosQR)).toString(
      'base64',
    );

    return { datoQR: datoQRBase64 };
  }
}
