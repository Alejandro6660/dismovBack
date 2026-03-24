import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Respuesta } from 'src/Respuesta/respuesta';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersService: UsersService) {}

  @Post('RegistrarUsuario')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.RegistrarUsuario(createUserDto);
    } catch (error) {
      this.logger.error('Error al registrar el usuario', error.stack);

      // 👇 Nest maneja el HTTP status
      throw new InternalServerErrorException(
        error.message || 'Error al registrar el usuario',
      );
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
