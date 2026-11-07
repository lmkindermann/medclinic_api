import { Consulta, ConsultaStatus } from '../entities/consulta';
import { ConsultaRepository } from '../repositories/consultaRepository';
import { MedicoRepository } from '../repositories/medicoRepository';
import { PacienteRepository } from '../repositories/pacienteRepository';
import { AppError } from '../utils/appError';

export interface CriarConsultaDTO {
    medicoId: string;
    pacienteId: string;
    dataHora: string;
}

export class ConsultaService {

    private consultaRepository = new ConsultaRepository();
    private medicoRepository = new MedicoRepository();
    private pacienteRepository = new PacienteRepository();

    async agendar(dados: CriarConsultaDTO): Promise<Consulta> {

        // 1. Validar os campos obrigatórios
        if (!dados.medicoId || !dados.pacienteId || !dados.dataHora) {
            throw new AppError('Médico, paciente e data/hora são obrigatórios.', 400);
        }

        // 2. Verificar se o médico existe
        const medico = await this.medicoRepository.buscarPorId(dados.medicoId);

        if (!medico) {
            throw new AppError('Médico não encontrado.', 404);
        }

        // 3. Verificar se o paciente existe
        const paciente = await this.pacienteRepository.buscarPorId(dados.pacienteId);

        if (!paciente) {
            throw new AppError('Paciente não encontrado.', 404);
        }

        // 4. Validar data e hora
        const dataHora = new Date(dados.dataHora);

        if (Number.isNaN(dataHora.getTime())) {
            throw new AppError('Data/hora inválida.', 400);
        }

        // 5. Impedir agendamentos no passado ou no momento atual
        if (dataHora <= new Date()) {
            throw new AppError('A data/hora da consulta deve ser futura.', 400);
        }

        // 6. Verificar conflito de horário para o médico
        const conflito = await this.consultaRepository.buscarConflitoMedico(
            dados.medicoId,
            dataHora
        );

        if (conflito) {
            throw new AppError(
                'Este médico já possui uma consulta agendada neste horário.',
                409
            );
        }

        // 7. Criar a consulta
        return this.consultaRepository.criar({
            medico,
            paciente,
            dataHora
        });
    }

    /* async listar(): Promise<Consulta[]> {
        return this.consultaRepository.listar();
    } */
    async listar(filtros: {
        dataInicial?: string;
        dataFinal?: string;
        status?: string;
        medicoId?: string;
        pacienteId?: string;
    }): Promise<Consulta[]> {

        const filtrosValidados: {
            dataInicial?: Date;
            dataFinal?: Date;
            status?: ConsultaStatus;
            medicoId?: string;
            pacienteId?: string;
        } = {};

        if (filtros.dataInicial) {
            const dataInicial = new Date(filtros.dataInicial);

            if (isNaN(dataInicial.getTime())) {
                throw new AppError('Data inicial inválida.', 400);
            }

            filtrosValidados.dataInicial = dataInicial;
        }

        /* if (filtros.dataFinal) {
            const dataFinal = new Date(filtros.dataFinal);

            if (isNaN(dataFinal.getTime())) {
                throw new AppError('Data final inválida.', 400);
            }

            filtrosValidados.dataFinal = dataFinal;
        } */
        if (filtros.dataFinal) {
            const dataFinal = new Date(
                /^\d{4}-\d{2}-\d{2}$/.test(filtros.dataFinal)
                    ? `${filtros.dataFinal}T23:59:59.999`
                    : filtros.dataFinal
            );

            if (isNaN(dataFinal.getTime())) {
                throw new AppError('Data final inválida.', 400);
            }

            filtrosValidados.dataFinal = dataFinal;
        }

        if (
            filtrosValidados.dataInicial &&
            filtrosValidados.dataFinal &&
            filtrosValidados.dataInicial > filtrosValidados.dataFinal
        ) {
            throw new AppError('A data inicial não pode ser posterior à data final.', 400);
        }

        if (filtros.status) {
            if (!Object.values(ConsultaStatus).includes(filtros.status as ConsultaStatus)) {
                throw new AppError('Status de consulta inválido.', 400);
            }

            filtrosValidados.status = filtros.status as ConsultaStatus;
        }

        if (filtros.medicoId) {
            filtrosValidados.medicoId = filtros.medicoId;
        }

        if (filtros.pacienteId) {
            filtrosValidados.pacienteId = filtros.pacienteId;
        }

        return this.consultaRepository.listar(filtrosValidados);
    }

    async buscarPorId(id: string): Promise<Consulta> {
        const consulta = await this.consultaRepository.buscarPorId(id);

        if (!consulta) {
            throw new AppError('Consulta não encontrada.', 404);
        }

        return consulta;
    }

    async realizarAtendimento(
        id: string,
        observacoes: string
    ): Promise<Consulta> {

        const consulta = await this.buscarPorId(id);

        if (consulta.status !== ConsultaStatus.AGENDADA) {
            throw new AppError(
                'Somente consultas agendadas podem ser realizadas.',
                400
            );
        }

        if (!observacoes || !observacoes.trim()) {
            throw new AppError(
                'As observações do atendimento são obrigatórias.',
                400
            );
        }

        consulta.status = ConsultaStatus.REALIZADA;
        consulta.observacoes = observacoes.trim();

        return this.consultaRepository.atualizar(consulta);
    }

    async cancelar(id: string): Promise<Consulta> {

        const consulta = await this.buscarPorId(id);

        if (consulta.status !== ConsultaStatus.AGENDADA) {
            throw new AppError(
                'Somente consultas agendadas podem ser canceladas.',
                400
            );
        }

        consulta.status = ConsultaStatus.CANCELADA;

        return this.consultaRepository.atualizar(consulta);
    }

}