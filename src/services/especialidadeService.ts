
import { Especialidade } from '../entities/especialidade';
import { EspecialidadeRepository } from '../repositories/especialidadeRepository';
import { AppError } from '../utils/appError';

interface CriarEspecialidadeDTO {
    nome: string;
    descricao?: string;
}

interface AtualizarEspecialidadeDTO {
    nome?: string;
    descricao?: string | null;
}

export class EspecialidadeService {
    private repository = new EspecialidadeRepository();

    async listar(): Promise<Especialidade[]> {
        return this.repository.listar();
    }

    async buscarPorId(id: string): Promise<Especialidade> {
        const especialidade = await this.repository.buscarPorId(id);

        if (!especialidade) {
            throw new AppError('Especialidade não encontrada.', 404);
        }

        return especialidade;
    }

    async criar(dados: CriarEspecialidadeDTO): Promise<Especialidade> {
        const nome = dados.nome?.trim();

        if (!nome) {
            throw new AppError('O nome da especialidade é obrigatório.', 400);
        }

        const existente = await this.repository.buscarPorNome(nome);

        if (existente) {
            throw new AppError('Já existe uma especialidade com esse nome.', 409);
        }

        return this.repository.criar({
            nome,
            descricao: dados.descricao?.trim() || null
        });
    }

    async atualizar(
        id: string,
        dados: AtualizarEspecialidadeDTO
    ): Promise<Especialidade> {
        const especialidade = await this.buscarPorId(id);

        if (dados.nome !== undefined) {
            const nome = dados.nome.trim();

            if (!nome) {
                throw new AppError('O nome da especialidade não pode ser vazio.', 400);
            }

            const existente = await this.repository.buscarPorNome(nome);

            if (existente && existente.id !== id) {
                throw new AppError('Já existe uma especialidade com esse nome.', 409);
            }

            especialidade.nome = nome;
        }

        if (dados.descricao !== undefined) {
            especialidade.descricao = dados.descricao?.trim() || null;
        }

        return this.repository.atualizar(especialidade);
    }

    async excluir(id: string): Promise<void> {
        const especialidade = await this.buscarPorId(id);

        // A verificação de médicos vinculados será adicionada
        // quando implementarmos a entidade Médico (RF02).

        await this.repository.excluir(especialidade);
    }
}
