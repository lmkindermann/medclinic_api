import { Consulta } from '../entities/consulta';
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

    async listar(): Promise<Consulta[]> {
        return this.consultaRepository.listar();
    }

    async buscarPorId(id: string): Promise<Consulta> {
        const consulta = await this.consultaRepository.buscarPorId(id);

        if (!consulta) {
            throw new AppError('Consulta não encontrada.', 404);
        }

        return consulta;
    }

}