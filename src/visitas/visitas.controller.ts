import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { IndicadoresService } from './services/indicadores.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { QueryVisitaDto } from './dto/query-visita.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('visitas')
@UseGuards(JwtAuthGuard)
export class VisitasController {
  constructor(
    private readonly visitasService: VisitasService,
    private readonly indicadoresService: IndicadoresService,
  ) {}

  /**
   * Crea una nueva visita y devuelve datos para generar QR
   */
  @Post()
  async create(@Body() createVisitaDto: CreateVisitaDto, @Request() req: any) {
    const usuarioId = req.user.id;
    return await this.visitasService.create(createVisitaDto, usuarioId);
  }

  /**
   * Obtiene todas las visitas con filtros opcionales
   */
  @Get()
  async findAll(@Query() query: QueryVisitaDto) {
    return await this.visitasService.findAll(query);
  }

  /**
   * Obtiene una visita específica por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.visitasService.findOne(+id);
  }

  /**
   * Actualiza una visita (marca como frecuente)
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVisitaDto: UpdateVisitaDto,
  ) {
    return await this.visitasService.update(+id, updateVisitaDto);
  }

  /**
   * Elimina una visita
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.visitasService.remove(+id);
  }

  /**
   * Confirma una visita al escanear un QR
   */
  @Post('confirmar/qr')
  async confirmarVisita(@Body() body: { datoQR: string }) {
    return await this.visitasService.confirmarVisita(body.datoQR);
  }

  /**
   * Regenera los datos del QR para una visita específica
   */
  @Get(':id/qr')
  async generarDatosQR(@Param('id') id: string) {
    return await this.visitasService.generarDatosQR(+id);
  }

  // ============ INDICADORES ============

  /**
   * Obtiene estadísticas totales de visitas
   */
  @Get('indicadores/estadisticas')
  async getEstadisticas(@Query('usuarioId') usuarioId?: string) {
    return await this.indicadoresService.getTotalVisitas(
      usuarioId ? +usuarioId : undefined,
    );
  }

  /**
   * Obtiene visitas agrupadas por día
   */
  @Get('indicadores/diarios')
  async getVisitasPorDia(
    @Query('usuarioId') usuarioId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.indicadoresService.getVisitasPorDia(
      usuarioId ? +usuarioId : undefined,
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined,
    );
  }

  /**
   * Obtiene visitantes marcados como frecuentes
   */
  @Get('indicadores/frecuentes')
  async getVisitantesFrecuentes(@Query('usuarioId') usuarioId?: string) {
    return await this.indicadoresService.getVisitantesFrecuentes(
      usuarioId ? +usuarioId : undefined,
    );
  }

  /**
   * Obtiene el ratio de visitas confirmadas vs pendientes
   */
  @Get('indicadores/ratio')
  async getRatioConfirmadas(
    @Query('usuarioId') usuarioId?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.indicadoresService.getRatioConfirmadas(
      usuarioId ? +usuarioId : undefined,
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined,
    );
  }

  /**
   * Obtiene el promedio de visitas por semana
   */
  @Get('indicadores/promedio-semana')
  async getPromedioPorSemana(@Query('usuarioId') usuarioId?: string) {
    return await this.indicadoresService.getPromedioPorSemana(
      usuarioId ? +usuarioId : undefined,
    );
  }

  /**
   * Obtiene el top 10 de visitantes frecuentes
   */
  @Get('indicadores/top10')
  async getTop10VisitantesFrecuentes(@Query('usuarioId') usuarioId?: string) {
    return await this.indicadoresService.getTop10VisitantesFrecuentes(
      usuarioId ? +usuarioId : undefined,
    );
  }
}
