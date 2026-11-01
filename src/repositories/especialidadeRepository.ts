import { AppDataSource } from '../database/datasource';
import { Especialidade } from '../entities/especialidade';

export class EspecialidadeRepository {
    private repository = AppDataSource.getRepository(Especialidade);

    async listar(): Promise<Especialidade[]> {
        return this.repository.find({
            order: { nome: 'ASC' }
        });
    }

    async buscarPorId(id: string): Promise<Especialidade | null> {
        return this.repository.findOneBy({ id });
    }

    async buscarPorNome(nome: string): Promise<Especialidade | null> {
        return this.repository.findOneBy({ nome });
    }

    async criar(dados: Partial<Especialidade>): Promise<Especialidade> {
        const especialidade = this.repository.create(dados);
        return this.repository.save(especialidade);
    }

    async atualizar(
        especialidade: Especialidade
    ): Promise<Especialidade> {
        return this.repository.save(especialidade);
    }

    async excluir(especialidade: Especialidade): Promise<void> {
        await this.repository.remove(especialidade);
    }
}