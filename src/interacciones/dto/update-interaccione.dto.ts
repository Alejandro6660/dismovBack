import { PartialType } from '@nestjs/mapped-types';
import { CreateInteraccioneDto } from './create-interaccione.dto';

export class UpdateInteraccioneDto extends PartialType(CreateInteraccioneDto) {}
