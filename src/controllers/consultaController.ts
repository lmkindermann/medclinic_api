import { Request, Response } from 'express';
import { ConsultaService } from '../services/consultaService';
import { AppError } from '../utils/appError';

export class ConsultaController {

    private consultaService = new ConsultaService();

    async agendar(req: Request, res: Response): Promise<void> {
        try {
            const consulta = await this.consultaService.agendar({
                medicoId: req.body.medicoId,
                pacienteId: req.body.pacienteId,
                dataHora: req.body.dataHora
            });

            res.status(201).json({
                mensagem: 'Consulta agendada com sucesso.',
                consulta
            });

        } catch (erro) {
            if (erro instanceof AppError) {
                res.status(erro.statusCode).json({
                    mensagem: erro.message
                });
                return;
            }

            console.error('Erro ao agendar consulta:', erro);

            res.status(500).json({
                mensagem: 'Erro interno ao agendar consulta.'
            });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const consultas = await this.consultaService.listar();

            res.status(200).json(consultas);

        } catch (erro) {
            console.error('Erro ao listar consultas:', erro);

            res.status(500).json({
                mensagem: 'Erro interno ao listar consultas.'
            });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const consulta = await this.consultaService.buscarPorId(
                String(req.params.id)
            );

            res.status(200).json(consulta);

        } catch (erro) {
            if (erro instanceof AppError) {
                res.status(erro.statusCode).json({
                    mensagem: erro.message
                });
                return;
            }

            console.error('Erro ao buscar consulta:', erro);

            res.status(500).json({
                mensagem: 'Erro interno ao buscar consulta.'
            });
        }
    }

}