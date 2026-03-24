import { Module } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { EncuestasController } from './encuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { EncuestaPartida } from './entities/encuesta-partida.entity';
import { EstatusEncuesta } from './entities/encuesta-estatus.entity';

@Module({
  controllers: [EncuestasController],
  providers: [EncuestasService],
  imports: [
    TypeOrmModule.forFeature([Encuesta, EncuestaPartida, EstatusEncuesta]),
  ],
})
export class EncuestasModule {}
