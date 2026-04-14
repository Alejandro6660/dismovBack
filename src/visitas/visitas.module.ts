import { Module } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { IndicadoresService } from './services/indicadores.service';
import { Visita } from './entities/visita.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [VisitasController],
  providers: [VisitasService, IndicadoresService],
  imports: [TypeOrmModule.forFeature([Visita])],
  exports: [VisitasService],
})
export class VisitasModule {}
