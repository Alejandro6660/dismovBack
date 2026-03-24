import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Pantalla {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  Nombre: string;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  FechaCreacion: Date;

  @Column('boolean', { default: true })
  EstaActivo: boolean;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'rel_usuario_pantalla',
    joinColumn: { name: 'pantallaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
  })
  Usuarios: User[];
}
