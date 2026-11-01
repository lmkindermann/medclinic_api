import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('especialidades')
export class Especialidade {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', { unique: true })
    nome!: string;

    @Column('varchar', { nullable: true })
    descricao?: string | null;
}