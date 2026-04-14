import { Injectable } from '@nestjs/common';
import { CrearAvisoDto } from './dto/create-interaccione.dto';
import { UpdateInteraccioneDto } from './dto/update-interaccione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaccion } from './entities/interaccion.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { EstatusInteraccion } from './entities/interaccion-estatus.entity';
import { TipoInteraccion } from './entities/interaccion-tipo.entity';

@Injectable()
export class InteraccionesService {
  constructor(
    @InjectRepository(Interaccion)
    private interaccionRepository: Repository<Interaccion>,
    @InjectRepository(EstatusInteraccion)
    private estatusRepository: Repository<EstatusInteraccion>,
    @InjectRepository(TipoInteraccion)
    private tipoRepository: Repository<TipoInteraccion>,
    private usersService: UsersService,
  ) {}

  async crearAviso(crearAvisoDto: CrearAvisoDto, idUsuario: number) {
    try {
      const user = await this.usersService.buscarUsuarioPorId(idUsuario);
      const estatusNueva = await this.estatusRepository.findOne({
        where: { numero: 1 },
      });
      const tipoAviso = await this.tipoRepository.findOne({
        where: { numero: 1 },
      });

      if (!user || !estatusNueva || !tipoAviso) {
        throw new Error('No se encontraron las dependencias necesarias');
      }

      // EL CAMBIO CLAVE:
      // Asegúrate de que los nombres del DTO no choquen con los de la entidad
      const datosInteraccion: DeepPartial<Interaccion> = {
        codigo: 'Aviso-' + Date.now(), // Verifica que no haya un typo aquí
        titulo: crearAvisoDto.titulo,
        descripcion: crearAvisoDto.descripcion,
        fechaCreacion: new Date(),
        estaActivo: true,
        usuario: user,
        interaccionEstatus: estatusNueva,
        tipoInteraccion: tipoAviso,
      };

      const nuevoAviso = this.interaccionRepository.create(datosInteraccion);

      return await this.interaccionRepository.save(nuevoAviso);
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear el aviso');
    }
  }

  async crearPublicacion(crearAvisoDto: CrearAvisoDto, idUsuario: number) {
    try {
      const user = await this.usersService.buscarUsuarioPorId(idUsuario);
      const estatusNueva = await this.estatusRepository.findOne({
        where: { numero: 1 },
      });
      const tipoAviso = await this.tipoRepository.findOne({
        where: { numero: 2 },
      });

      if (!user || !estatusNueva || !tipoAviso) {
        throw new Error('No se encontraron las dependencias necesarias');
      }

      // EL CAMBIO CLAVE:
      // Asegúrate de que los nombres del DTO no choquen con los de la entidad
      const datosInteraccion: DeepPartial<Interaccion> = {
        codigo: 'PUB-' + Date.now(), // Verifica que no haya un typo aquí
        titulo: crearAvisoDto.titulo,
        descripcion: crearAvisoDto.descripcion,
        fechaCreacion: new Date(),
        estaActivo: true,
        usuario: user,
        interaccionEstatus: estatusNueva,
        tipoInteraccion: tipoAviso,
      };

      const nuevoAviso = this.interaccionRepository.create(datosInteraccion);

      return await this.interaccionRepository.save(nuevoAviso);
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear el aviso');
    }
  }

  // Método create para compatibilidad con el controlador
  async create(crearAvisoDto: CrearAvisoDto) {
    return this.crearAviso(crearAvisoDto, 1); // Usa usuario por defecto
  }

  findAll() {
    return `This action returns all interacciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interaccione`;
  }

  update(id: number, updateInteraccioneDto: UpdateInteraccioneDto) {
    return `This action updates a #${id} interaccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaccione`;
  }
}
