import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TipoInteraccion {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  nombre: string;

  @Column()
  numero: number;

  @Column({ default: true })
  estaActivo: boolean;
}
