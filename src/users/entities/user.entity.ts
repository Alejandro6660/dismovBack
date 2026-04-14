import { Encuesta } from 'src/encuestas/entities/encuesta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolUser } from './rolUser.entity';
import { Interaccion } from 'src/interacciones/entities/interaccion.entity';
import { Comentario } from 'src/comentarios/entities/comentario.entity';
import { Visita } from 'src/visitas/entities/visita.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  Nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  Apellido: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  NombreUsuario: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  Email: string;

  @Column({
    type: 'varchar',
  })
  PasswordHash: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  RefreshTokenHash: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  Telefono: string;

  @Column('boolean', { default: true })
  EstaActivo: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  FechaCreacion: Date;

  // 🔹 Encuestas creadas
  @OneToMany(() => Encuesta, (encuesta) => encuesta.usuarioCreador)
  encuestasCreadas: Encuesta[];

  @OneToOne(() => RolUser)
  @JoinColumn({
    name: 'RolUsuario',
    referencedColumnName: 'id',
  })
  RolUsuario: RolUser;

  @OneToMany(() => Interaccion, (interaccion) => interaccion.usuario)
  interacciones: Interaccion[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuarioCreador)
  comentarios: Comentario[];

  @OneToMany(() => Visita, (visita) => visita.usuarioCreador)
  visitas: Visita[];
}
