import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Encuesta } from './encuesta.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class EncuestaPartida {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  titulo: string;

  @Column({ default: 0 })
  totalVotos: number;

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.id)
  encuesta: Encuesta;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'rel_usuario_encuesta_partida',
    joinColumn: { name: 'encuestaPartidaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
  })
  Usuarios: User[];
}
