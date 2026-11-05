import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pacientes')
export class Paciente {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar')
    nome!: string;

    @Column('varchar', { unique: true })
    cpf!: string;

    @Column('date')
    dataNascimento!: string;

    @Column('varchar')
    email!: string;

    @Column('varchar', { nullable: true })
    telefone?: string | null;
}