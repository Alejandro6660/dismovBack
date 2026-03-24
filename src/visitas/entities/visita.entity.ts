import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Visita {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  codigo: string;

  @Column({
    type: 'int',
  })
  consecutivo: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  nombreVisitante: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  Telefono: string;

  @Column('boolean', { default: true })
  EstaActivo: boolean;

  @Column('boolean', { default: false })
  esFrecuente: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  fechaIngreso: Date;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  fechaEgreso: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  usuarioCreador: User;
}
