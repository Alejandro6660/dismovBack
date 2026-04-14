import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

export enum EstadoVisita {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
}

@Entity()
@Index(['usuarioId', 'estado'])
@Index(['fechaCreacion'])
export class Visita {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nombreVisitante: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: EstadoVisita,
    default: EstadoVisita.PENDIENTE,
  })
  estado: EstadoVisita;

  @Column('boolean', { default: false })
  esFrecuente: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column('timestamp', { nullable: true })
  fechaConfirmacion: Date;

  @ManyToOne(() => User, (user) => user.visitas)
  @JoinColumn({ name: 'usuarioId' })
  usuarioCreador: User;

  @Column({ type: 'bigint', nullable: true })
  usuarioId: number;
}
