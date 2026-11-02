import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medico } from './medico';

@Entity('especialidades')
export class Especialidade {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', { unique: true })
    nome!: string;

    @Column('varchar', { nullable: true })
    descricao?: string | null;

    @OneToMany(() => Medico, medico => medico.especialidade)
    medicos!: Medico[];
}