import { Module } from '@nestjs/common';
import { InteraccionesService } from './interacciones.service';
import { InteraccionesController } from './interacciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaccion } from './entities/interaccion.entity';
import { EstatusInteraccion } from './entities/interaccion-estatus.entity';
import { TipoInteraccion } from './entities/interaccion-tipo.entity';

@Module({
  controllers: [InteraccionesController],
  providers: [InteraccionesService],
  imports: [
    TypeOrmModule.forFeature([
      Interaccion,
      EstatusInteraccion,
      TipoInteraccion,
    ]),
  ],
})
export class InteraccionesModule {}
