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
    /* async listar(filtros?: {
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
    } */
    async listar(
        filtros: {
            dataInicial?: Date;
            dataFinal?: Date;
            status?: ConsultaStatus;
            medicoId?: string;
            pacienteId?: string;
        },
        page: number,
        limit: number
    ): Promise<{
        registros: Consulta[];
        total: number;
    }> {
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
            //query.andWhere('consulta.medicoId = :medicoId', {
            query.andWhere('medico.id = :medicoId', {
                medicoId: filtros.medicoId
            });
        }

        if (filtros?.pacienteId) {
            //query.andWhere('consulta.pacienteId = :pacienteId', {
            query.andWhere('paciente.id = :pacienteId', {
                pacienteId: filtros.pacienteId
            });
        }

        const [registros, total] = await query
            .orderBy('consulta.dataHora', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { registros, total };
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

    async relatorioPorStatus() {
        const resultado = await this.repository
            .createQueryBuilder('consulta')
            .select('consulta.status', 'status')
            .addSelect('COUNT(consulta.id)', 'total')
            .groupBy('consulta.status')
            .orderBy('consulta.status', 'ASC')
            .getRawMany();

        return resultado.map(item => ({
            status: item.status,
            total: Number(item.total)
        }));
    }

    async relatorioPorMedico() {
        const resultado = await this.repository
            .createQueryBuilder('consulta')
            .innerJoin('consulta.medico', 'medico')
            .select('medico.id', 'medicoId')
            .addSelect('medico.nome', 'nome')
            .addSelect('COUNT(consulta.id)', 'total')
            .groupBy('medico.id')
            .addGroupBy('medico.nome')
            .orderBy('medico.nome', 'ASC')
            .getRawMany();

        return resultado.map(item => ({
            medicoId: item.medicoId,
            nome: item.nome,
            total: Number(item.total)
        }));
    }

    async relatorioPacientesAgendados() {
        const resultado = await this.repository
            .createQueryBuilder('consulta')
            .innerJoin('consulta.paciente', 'paciente')
            .select('paciente.id', 'pacienteId')
            .addSelect('paciente.nome', 'nome')
            .addSelect('COUNT(consulta.id)', 'total')
            .where('consulta.status = :status', { status: ConsultaStatus.AGENDADA })
            .groupBy('paciente.id')
            .addGroupBy('paciente.nome')
            .orderBy('paciente.nome', 'ASC')
            .getRawMany();

        return resultado.map(item => ({
            pacienteId: item.pacienteId,
            nome: item.nome,
            total: Number(item.total)
        }));
    }

}