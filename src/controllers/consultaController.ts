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

    /* async listar(req: Request, res: Response): Promise<void> {
        try {
            const consultas = await this.consultaService.listar();

            res.status(200).json(consultas);

        } catch (erro) {
            console.error('Erro ao listar consultas:', erro);

            res.status(500).json({
                mensagem: 'Erro interno ao listar consultas.'
            });
        }
    } */
    async listar(req: Request, res: Response): Promise<Response> {
        try {
            const filtros = {
                dataInicial: req.query.dataInicial as string,
                dataFinal: req.query.dataFinal as string,
                status: req.query.status as string,
                medicoId: req.query.medicoId as string,
                pacienteId: req.query.pacienteId as string
            };

            const consultas = await this.consultaService.listar(filtros);

            return res.status(200).json(consultas);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
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

    async realizarAtendimento(req: Request, res: Response) {
        try {
            const consulta = await this.consultaService.realizarAtendimento(
                String(req.params.id),
                req.body.observacoes
            );

            return res.status(200).json({
                mensagem: 'Atendimento realizado com sucesso.',
                consulta
            });

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    erro: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                erro: 'Erro interno ao realizar atendimento.'
            });
        }
    }

    async cancelar(req: Request, res: Response) {
        try {
            const consulta = await this.consultaService.cancelar(
                String(req.params.id)
            );

            return res.status(200).json({
                mensagem: 'Consulta cancelada com sucesso.',
                consulta
            });

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    erro: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                erro: 'Erro interno ao cancelar consulta.'
            });
        }
    }

}