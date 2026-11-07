import { PacienteRepository } from '../repositories/pacienteRepository';
import { Paciente } from '../entities/paciente';
import { AppError } from '../utils/appError';

interface CriarPacienteDTO {
    nome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone?: string;
}

interface AtualizarPacienteDTO {
    nome?: string;
    cpf?: string;
    dataNascimento?: string;
    email?: string;
    telefone?: string;
}

export class PacienteService {

    private repository = new PacienteRepository();

    private validarCPF(cpf: string): boolean {
        const numero = cpf.replace(/\D/g, '');
        if (numero.length !== 11 || /^(\d)\1{10}$/.test(numero)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += Number(numero[i]) * (10 - i);
        }

        let digito = (soma * 10) % 11;
        if (digito === 10) digito = 0;
        if (digito !== Number(numero[9])) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number(numero[i]) * (11 - i);
        }

        digito = (soma * 10) % 11;
        if (digito === 10) digito = 0;
        return digito === Number(numero[10]);
    }

    private validarEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private validarDataNascimento(data: string): boolean {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            return false;
        }

        const dataInformada = new Date(`${data}T00:00:00`);
        if (Number.isNaN(dataInformada.getTime())) {
            return false;
        }

        return dataInformada.toISOString().slice(0, 10) === data
            && dataInformada < new Date(new Date().toDateString());
    }

    // Listar e consultar pacientes
    /* async listar(): Promise<Paciente[]> {
        return this.repository.listar();
    } */
    async listar(filtros: {
        nome?: string;
    }): Promise<Paciente[]> {

        const filtrosValidados: {
            nome?: string;
        } = {};

        if (filtros.nome) {
            filtrosValidados.nome = filtros.nome.trim();

            if (!filtrosValidados.nome) {
                throw new AppError('Nome inválido.', 400);
            }
        }

        return this.repository.listar(filtrosValidados);
    }

    async buscarPorId(id: string): Promise<Paciente> {
        const paciente = await this.repository.buscarPorId(id);

        if (!paciente) {
            throw new AppError('Paciente não encontrado.', 404);
        }

        return paciente;
    }

    // Criar paciente
    async criar(dados: CriarPacienteDTO): Promise<Paciente> {
        if (!dados.nome?.trim()) {
            throw new AppError('O nome do paciente é obrigatório.', 400);
        }

        if (!dados.cpf || !this.validarCPF(dados.cpf)) {
            throw new AppError('CPF inválido.', 400);
        }

        if (!dados.email || !this.validarEmail(dados.email)) {
            throw new AppError('E-mail inválido.', 400);
        }

        if (!dados.dataNascimento || !this.validarDataNascimento(dados.dataNascimento)) {
            throw new AppError('Data de nascimento inválida.', 400);
        }

        const cpf = dados.cpf.replace(/\D/g, '');

        const pacienteExistente = await this.repository.buscarPorCPF(cpf);

        if (pacienteExistente) {
            throw new AppError('Já existe um paciente cadastrado com este CPF.', 409);
        }

        return this.repository.criar({
            ...dados,
            cpf
        });
    }

    // Atualizar paciente
    async atualizar(
        id: string,
        dados: AtualizarPacienteDTO
    ): Promise<Paciente> {

        const paciente = await this.buscarPorId(id);

        if (dados.nome !== undefined) {
            if (!dados.nome.trim()) {
                throw new AppError('O nome do paciente não pode ser vazio.', 400);
            }

            paciente.nome = dados.nome;
        }

        if (dados.cpf !== undefined) {
            if (!this.validarCPF(dados.cpf)) {
                throw new AppError('CPF inválido.', 400);
            }

            const cpf = dados.cpf.replace(/\D/g, '');

            const pacienteExistente = await this.repository.buscarPorCPF(cpf);

            if (pacienteExistente && pacienteExistente.id !== id) {
                throw new AppError('Já existe um paciente cadastrado com este CPF.', 409);
            }

            paciente.cpf = cpf;
        }

        if (dados.email !== undefined) {
            if (!this.validarEmail(dados.email)) {
                throw new AppError('E-mail inválido.', 400);
            }

            paciente.email = dados.email;
        }

        if (dados.dataNascimento !== undefined) {
            if (!this.validarDataNascimento(dados.dataNascimento)) {
                throw new AppError('Data de nascimento inválida.', 400);
            }

            paciente.dataNascimento = dados.dataNascimento;
        }

        if (dados.telefone !== undefined) {
            paciente.telefone = dados.telefone;
        }

        return this.repository.atualizar(paciente);
    }

    // Excluir paciente
    async excluir(id: string): Promise<void> {
        const paciente = await this.buscarPorId(id);

        await this.repository.excluir(paciente);
    }
}