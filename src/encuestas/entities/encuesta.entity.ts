import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EncuestaPartida } from './encuesta-partida.entity';
import { EstatusEncuesta } from './encuesta-estatus.entity';

@Entity()
@Entity()
export class Encuesta {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  codigo: string;

  @Column({ type: 'varchar' })
  titulo: string;

  @Column({ type: 'decimal' })
  descripcion: number;

  @Column({ type: 'date' })
  fechaCreacion: Date;

  @Column({ type: 'date' })
  fechaLimite: Date;

  @Column({ type: 'date' })
  fechaCierre: Date;

  @Column({ default: 0 })
  totalVotos: number;

  // FK -> EstatusEncuesta
  @OneToOne(() => EstatusEncuesta)
  @JoinColumn({ name: 'estatusId' })
  estatus: EstatusEncuesta;

  // FK -> EncuestaPartida (ganador)
  @ManyToOne(() => EncuestaPartida)
  @JoinColumn({ name: 'ganadorId' })
  ganador: EncuestaPartida;

  // FK -> Usuario (creador)
  @ManyToOne(() => User, (usuario) => usuario.encuestasCreadas)
  @JoinColumn({ name: 'usuarioCreadorId' })
  usuarioCreador: User;

  @OneToMany(() => EncuestaPartida, (partida) => partida.encuesta)
  partidas: EncuestaPartida[];
}
