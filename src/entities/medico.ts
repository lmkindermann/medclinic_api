import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Especialidade } from './especialidade';

@Entity('medicos')
export class Medico {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar')
    nome!: string;

    @Column('varchar', { unique: true })
    crm!: string;

    @ManyToOne(
        () => Especialidade,
        especialidade => especialidade.medicos,
        {
            nullable: false,
            onDelete: 'RESTRICT'
        }
    )
    @JoinColumn({ name: 'especialidade_id' })
    especialidade!: Especialidade;
}