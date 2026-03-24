import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Respuesta } from 'src/Respuesta/respuesta';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async RegistrarUsuario(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({
        Nombre: createUserDto.Nombre,
        Apellido: createUserDto.Apellido,
        NombreUsuario: createUserDto.NombreUsuario,
        Email: createUserDto.Correo,
        Password: createUserDto.Password,
        Telefono: createUserDto.Telefono,
        FechaCreacion: new Date(),
      });

      await this.userRepository.save(user);

      return {
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      // 🔥 log real
      console.log(error);

      if (error.code === '23505') {
        throw new ConflictException('El usuario o correo ya existe');
      }

      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
