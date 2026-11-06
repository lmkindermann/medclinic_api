import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from './medico';
import { Paciente } from './paciente';

export enum ConsultaStatus {
    AGENDADA = 'AGENDADA',
    REALIZADA = 'REALIZADA',
    CANCELADA = 'CANCELADA'
}

@Entity('consultas')
export class Consulta {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('timestamp')
    dataHora!: Date;

    @Column({
        type: 'enum',
        enum: ConsultaStatus,
        default: ConsultaStatus.AGENDADA
    })
    status!: ConsultaStatus;

    @Column('text', { nullable: true })
    observacoes?: string | null;

    @ManyToOne(() => Medico, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'medico_id' })
    medico!: Medico;

    @ManyToOne(() => Paciente, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'paciente_id' })
    paciente!: Paciente;
}