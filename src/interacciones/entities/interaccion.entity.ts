import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstatusInteraccion } from './interaccion-estatus.entity';
import { TipoInteraccion } from './interaccion-tipo.entity';

@Entity()
export class Interaccion {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  codigo: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column({ type: 'date' })
  fechaCreacion: Date;

  @Column({ default: true })
  estaActivo: boolean;

  @ManyToOne(() => User, (usuario) => usuario.interacciones)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @OneToOne(() => EstatusInteraccion)
  @JoinColumn({ name: 'interaccionEstatusId' })
  interaccionEstatus: EstatusInteraccion; // <--- Este es el nombre correcto

  @OneToOne(() => TipoInteraccion)
  @JoinColumn({ name: 'interaccionTipoId' })
  tipoInteraccion: TipoInteraccion;
}
