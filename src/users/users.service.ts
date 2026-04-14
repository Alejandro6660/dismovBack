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
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // 🔹 Repositorio público para acceso desde Auth Service
  userRepository: Repository<User>;

  constructor(@InjectRepository(User) _userRepository: Repository<User>) {
    this.userRepository = _userRepository;
  }

  // 🔹 Métodos de hashing y validación de contraseñas
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }

  // 🔹 Búsqueda de usuarios
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { Email: email } });
  }

  async findByNombreUsuario(nombreUsuario: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { NombreUsuario: nombreUsuario },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['RolUsuario'],
    });
  }

  // 🔹 Métodos existentes actualizados

  async RegistrarUsuario(createUserDto: CreateUserDto) {
    try {
      // Hashear la contraseña
      const passwordHash = await this.hashPassword(createUserDto.Password);

      const user = this.userRepository.create({
        Nombre: createUserDto.Nombre,
        Apellido: createUserDto.Apellido,
        NombreUsuario: createUserDto.NombreUsuario,
        Email: createUserDto.Correo,
        PasswordHash: passwordHash,
        Telefono: createUserDto.Telefono,
        FechaCreacion: new Date(),
        EstaActivo: true,
      });

      await this.userRepository.save(user);

      return {
        message: 'Usuario registrado exitosamente',
      };
    } catch (error: any) {
      // 🔥 log real
      console.log(error);

      if (error.code === '23505') {
        throw new ConflictException('El usuario o correo ya existe');
      }

      throw new InternalServerErrorException('Error al registrar el usuario');
    }
  }

  async findAll() {
    return this.userRepository.find({
      select: [
        'id',
        'Nombre',
        'Apellido',
        'NombreUsuario',
        'Email',
        'Telefono',
        'EstaActivo',
        'FechaCreacion',
      ],
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.findById(id);
  }

  async buscarUsuarioPorId(id: number): Promise<User | null> {
    return this.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
