import { AppDataSource } from '../database/datasource';
import { Consulta, ConsultaStatus } from '../entities/consulta';

export class ConsultaRepository {

    private repository = AppDataSource.getRepository(Consulta);

    async listar(): Promise<Consulta[]> {
        return this.repository.find({
            relations: {
                medico: true,
                paciente: true
            },
            order: {
                dataHora: 'ASC'
            }
        });
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