import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService],
  imports: [TypeOrmModule.forFeature([Comentario])],
})
export class ComentariosModule {}
