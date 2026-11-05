import { Request, Response } from 'express';
import { PacienteService } from '../services/pacienteService';
import { AppError } from '../utils/appError';

export class PacienteController {

    private service = new PacienteService();

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const pacientes = await this.service.listar();
            res.status(200).json(pacientes);
        } catch (error) {
            this.tratarErro(error, res);
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const paciente = await this.service.buscarPorId(String(req.params.id));
            res.status(200).json(paciente);
        } catch (error) {
            this.tratarErro(error, res);
        }
    }

    async criar(req: Request, res: Response): Promise<void> {
        try {
            const paciente = await this.service.criar(req.body);
            res.status(201).json(paciente);
        } catch (error) {
            this.tratarErro(error, res);
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const paciente = await this.service.atualizar(String(req.params.id), req.body);
            res.status(200).json(paciente);
        } catch (error) {
            this.tratarErro(error, res);
        }
    }

    async excluir(req: Request, res: Response): Promise<void> {
        try {
            await this.service.excluir(String(req.params.id));
            res.status(204).send();
        } catch (error) {
            this.tratarErro(error, res);
        }
    }

    private tratarErro(error: unknown, res: Response): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                erro: error.message
            });
            return;
        }

        console.error(error);

        res.status(500).json({
            erro: 'Erro interno do servidor.'
        });
    }
}