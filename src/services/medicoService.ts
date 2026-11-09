import { Medico } from '../entities/medico';
import { EspecialidadeRepository } from '../repositories/especialidadeRepository';
import { MedicoRepository } from '../repositories/medicoRepository';
import { AppError } from '../utils/appError';

interface CriarMedicoDTO {
    nome: string;
    crm: string;
    especialidadeId: string;
}

interface AtualizarMedicoDTO {
    nome?: string;
    crm?: string;
    especialidadeId?: string;
}

export class MedicoService {

    private medicoRepository = new MedicoRepository();
    private especialidadeRepository = new EspecialidadeRepository();

    /* async listar(): Promise<Medico[]> {
        return this.medicoRepository.listar();
    } */
    /* async listar(filtros: {
        nome?: string;
        especialidadeId?: string;
    }): Promise<Medico[]> {

        const filtrosValidados: {
            nome?: string;
            especialidadeId?: string;
        } = {};

        if (filtros.nome) {
            filtrosValidados.nome = filtros.nome.trim();

            if (!filtrosValidados.nome) {
                throw new AppError('Nome inválido.', 400);
            }
        }

        if (filtros.especialidadeId) {
            filtrosValidados.especialidadeId = filtros.especialidadeId;
        }

        return this.medicoRepository.listar(filtrosValidados);
    } */
    async listar(
        filtros: {
            nome?: string;
            especialidadeId?: string;
        },
        page: number,
        limit: number
    ): Promise<{
        registros: Medico[];
        total: number;
    }> {

        const filtrosValidados: {
            nome?: string;
            especialidadeId?: string;
        } = {};

        if (filtros.nome) {
            filtrosValidados.nome = filtros.nome.trim();

            if (!filtrosValidados.nome) {
                throw new AppError('Nome inválido.', 400);
            }
        }

        if (filtros.especialidadeId) {
            filtrosValidados.especialidadeId = filtros.especialidadeId;
        }

        return this.medicoRepository.listar(
            filtrosValidados,
            page,
            limit
        );
    }

    async buscarPorId(id: string): Promise<Medico> {
        const medico = await this.medicoRepository.buscarPorId(id);

        if (!medico) {
            throw new AppError('Médico não encontrado.', 404);
        }

        return medico;
    }

    async criar(dados: CriarMedicoDTO): Promise<Medico> {

        // Validar nome
        if (typeof dados.nome !== 'string' || !dados.nome.trim()) {
            throw new AppError('O nome do médico é obrigatório.', 400);
        }

        // Validar CRM
        if (typeof dados.crm !== 'string' || !dados.crm.trim()) {
            throw new AppError('O CRM do médico é obrigatório.', 400);
        }

        const nome = dados.nome.trim();
        const crm = dados.crm.trim();

        // Verificar se o CRM já está cadastrado
        const medicoExistente = await this.medicoRepository.buscarPorCRM(crm);

        if (medicoExistente) {
            throw new AppError('Já existe um médico cadastrado com esse CRM.', 409);
        }

        // Validar especialidade
        if (typeof dados.especialidadeId !== 'string' || !dados.especialidadeId.trim()) {
            throw new AppError('A especialidade é obrigatória.', 400);
        }

        const especialidade = await this.especialidadeRepository.buscarPorId(
            dados.especialidadeId
        );

        if (!especialidade) {
            throw new AppError('Especialidade não encontrada.', 404);
        }

        return this.medicoRepository.criar({
            nome,
            crm,
            especialidade
        });
    }

    async atualizar(
        id: string,
        dados: AtualizarMedicoDTO
    ): Promise<Medico> {

        const medico = await this.buscarPorId(id);

        // Atualizar nome, se informado
        if (dados.nome !== undefined) {

            if (typeof dados.nome !== 'string' || !dados.nome.trim()) {
                throw new AppError('O nome do médico não pode ser vazio.', 400);
            }

            medico.nome = dados.nome.trim();
        }

        // Atualizar CRM, se informado
        if (dados.crm !== undefined) {

            if (typeof dados.crm !== 'string' || !dados.crm.trim()) {
                throw new AppError('O CRM do médico não pode ser vazio.', 400);
            }

            const crm = dados.crm.trim();

            const medicoExistente = await this.medicoRepository.buscarPorCRM(crm);

            if (medicoExistente && medicoExistente.id !== id) {
                throw new AppError('Já existe um médico cadastrado com esse CRM.', 409);
            }

            medico.crm = crm;
        }

        // Atualizar especialidade, se informada
        if (dados.especialidadeId !== undefined) {

            if (
                typeof dados.especialidadeId !== 'string' ||
                !dados.especialidadeId.trim()
            ) {
                throw new AppError('A especialidade informada é inválida.', 400);
            }

            const especialidade = await this.especialidadeRepository.buscarPorId(
                dados.especialidadeId
            );

            if (!especialidade) {
                throw new AppError('Especialidade não encontrada.', 404);
            }

            medico.especialidade = especialidade;
        }

        return this.medicoRepository.atualizar(medico);
    }

    async excluir(id: string): Promise<void> {

        const medico = await this.buscarPorId(id);

        await this.medicoRepository.excluir(medico);
    }
}