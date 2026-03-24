import { Injectable } from '@nestjs/common';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { UpdateEncuestaDto } from './dto/update-encuesta.dto';

@Injectable()
export class EncuestasService {
  create(createEncuestaDto: CreateEncuestaDto) {
    return 'This action adds a new encuesta';
  }

  findAll() {
    return `This action returns all encuestas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} encuesta`;
  }

  update(id: number, updateEncuestaDto: UpdateEncuestaDto) {
    return `This action updates a #${id} encuesta`;
  }

  remove(id: number) {
    return `This action removes a #${id} encuesta`;
  }
}
