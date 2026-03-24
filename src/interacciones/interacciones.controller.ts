import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteraccionesService } from './interacciones.service';
import { CreateInteraccioneDto } from './dto/create-interaccione.dto';
import { UpdateInteraccioneDto } from './dto/update-interaccione.dto';

@Controller('interacciones')
export class InteraccionesController {
  constructor(private readonly interaccionesService: InteraccionesService) {}

  @Post()
  create(@Body() createInteraccioneDto: CreateInteraccioneDto) {
    return this.interaccionesService.create(createInteraccioneDto);
  }

  @Get()
  findAll() {
    return this.interaccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interaccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInteraccioneDto: UpdateInteraccioneDto) {
    return this.interaccionesService.update(+id, updateInteraccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interaccionesService.remove(+id);
  }
}
