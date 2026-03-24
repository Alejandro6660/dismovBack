import { Interaccion } from 'src/interacciones/entities/interaccion.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  comentario: string;

  @Column({ type: 'date' })
  fechaCreacion: Date;

  @ManyToOne(() => Comentario, (comentario) => comentario.id)
  comentarioPadre: Comentario;

  @ManyToOne(() => Interaccion, (interaccion) => interaccion.id)
  @JoinColumn({ name: 'interaccionId' })
  interaccion: Interaccion;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  usuarioCreador: User;
}
