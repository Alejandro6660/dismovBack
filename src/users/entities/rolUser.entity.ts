import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RolUser {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  Nombre: string;

  @Column('boolean', { default: true })
  EstaActivo: boolean;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  FechaCreacion: Date;
}
