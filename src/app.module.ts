import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EncuestasModule } from './encuestas/encuestas.module';
import { OrdenCompraModule } from './orden-compra/orden-compra.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { VisitasModule } from './visitas/visitas.module';
import { ProductosModule } from './productos/productos.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development.local'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    EncuestasModule,
    OrdenCompraModule,
    InteraccionesModule,
    VisitasModule,
    ProductosModule,
    MovimientosModule,
    ComentariosModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
