import { AppDataSource } from '../database/datasource';
import { Medico } from '../entities/medico';

export class MedicoRepository {

    private repository = AppDataSource.getRepository(Medico);

    // Listar todos os médicos, incluindo suas especialidades
    async listar(): Promise<Medico[]> {
        return this.repository.find({
            relations: {
                especialidade: true
            },
            order: {
                nome: 'ASC'
            }
        });
    }

    // Buscar médico pelo ID
    async buscarPorId(id: string): Promise<Medico | null> {
        return this.repository.findOne({
            where: { id },
            relations: {
                especialidade: true
            }
        });
    }

    // Buscar médico pelo CRM
    async buscarPorCRM(crm: string): Promise<Medico | null> {
        return this.repository.findOneBy({ crm });
    }

    // Criar médico
    async criar(dados: Partial<Medico>): Promise<Medico> {
        const medico = this.repository.create(dados);
        return this.repository.save(medico);
    }

    // Atualizar médico
    async atualizar(medico: Medico): Promise<Medico> {
        return this.repository.save(medico);
    }

    // Excluir médico
    async excluir(medico: Medico): Promise<void> {
        await this.repository.remove(medico);
    }

    async existePorEspecialidade(especialidadeId: string): Promise<boolean> {
        const quantidade = await this.repository.count({
            where: {
                especialidade: {
                    id: especialidadeId
                }
            }
        });
        return quantidade > 0;
    }
}