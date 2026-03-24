import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Encuesta } from './encuesta.entity';

@Entity()
export class EstatusEncuesta {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  numero: number;

  @Column({ default: true })
  estaActivo: boolean;
}
