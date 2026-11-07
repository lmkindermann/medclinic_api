import { AppDataSource } from '../database/datasource';
import { Consulta, ConsultaStatus } from '../entities/consulta';

export class ConsultaRepository {

    private repository = AppDataSource.getRepository(Consulta);

    /* async listar(): Promise<Consulta[]> {
        return this.repository.find({
            relations: {
                medico: true,
                paciente: true
            },
            order: {
                dataHora: 'ASC'
            }
        });
    } */
    async listar(filtros?: {
        dataInicial?: Date;
        dataFinal?: Date;
        status?: ConsultaStatus;
        medicoId?: string;
        pacienteId?: string;
    }): Promise<Consulta[]> {

        const query = this.repository
            .createQueryBuilder('consulta')
            .leftJoinAndSelect('consulta.medico', 'medico')
            .leftJoinAndSelect('consulta.paciente', 'paciente');

        if (filtros?.dataInicial) {
            query.andWhere('consulta.dataHora >= :dataInicial', {
                dataInicial: filtros.dataInicial
            });
        }

        if (filtros?.dataFinal) {
            query.andWhere('consulta.dataHora <= :dataFinal', {
                dataFinal: filtros.dataFinal
            });
        }

        if (filtros?.status) {
            query.andWhere('consulta.status = :status', {
                status: filtros.status
            });
        }

        if (filtros?.medicoId) {
            query.andWhere('medico.id = :medicoId', {
                medicoId: filtros.medicoId
            });
        }

        if (filtros?.pacienteId) {
            query.andWhere('paciente.id = :pacienteId', {
                pacienteId: filtros.pacienteId
            });
        }

        return query
            .orderBy('consulta.dataHora', 'ASC')
            .getMany();
    }

    async buscarPorId(id: string): Promise<Consulta | null> {
        return this.repository.findOne({
            where: { id },
            relations: {
                medico: true,
                paciente: true
            }
        });
    }

    async buscarConflitoMedico(
        medicoId: string,
        dataHora: Date
    ): Promise<Consulta | null> {
        return this.repository.findOne({
            where: {
                medico: { id: medicoId },
                dataHora,
                status: ConsultaStatus.AGENDADA
            }
        });
    }

    async criar(dados: Partial<Consulta>): Promise<Consulta> {
        const consulta = this.repository.create(dados);
        return this.repository.save(consulta);
    }

    async atualizar(consulta: Consulta): Promise<Consulta> {
        return this.repository.save(consulta);
    }

}