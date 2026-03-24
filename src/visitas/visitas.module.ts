import { Module } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { Visita } from './entities/visita.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [VisitasController],
  providers: [VisitasService],
  imports: [TypeOrmModule.forFeature([Visita])],
})
export class VisitasModule {}
