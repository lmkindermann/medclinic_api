import { Request, Response } from 'express';
import { ConsultaService } from '../services/consultaService';
import { AppError } from '../utils/appError';
import logger from '../config/logger';

export class ConsultaController {

    private consultaService = new ConsultaService();

    async agendar(req: Request, res: Response): Promise<void> {
        try {
            const consulta = await this.consultaService.agendar({
                medicoId: req.body.medicoId,
                pacienteId: req.body.pacienteId,
                dataHora: req.body.dataHora
            });

            logger.info('Consulta agendada com sucesso.', {
                consultaId: consulta.id
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

            //console.error('Erro ao agendar consulta:', erro);
            logger.error('Erro ao agendar consulta.', {
                erro: erro instanceof Error ? erro.stack : String(erro)
            });

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
            const pageParam = req.query.page;
            const limitParam = req.query.limit;

            if (
                (pageParam !== undefined && typeof pageParam !== 'string') ||
                (limitParam !== undefined && typeof limitParam !== 'string')
            ) {
                throw new AppError('Parâmetros de paginação inválidos.', 400);
            }

            const page = pageParam === undefined ? 1 : Number(pageParam);
            const limit = limitParam === undefined ? 10 : Number(limitParam);

            if (!Number.isInteger(page) || page < 1) {
                throw new AppError('O parâmetro page deve ser um inteiro maior que zero.', 400);
            }

            if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
                throw new AppError('O parâmetro limit deve ser um inteiro entre 1 e 100.', 400);
            }

            const filtros = {
                dataInicial: req.query.dataInicial as string,
                dataFinal: req.query.dataFinal as string,
                status: req.query.status as string,
                medicoId: req.query.medicoId as string,
                pacienteId: req.query.pacienteId as string
            };

            const consultas = await this.consultaService.listar(filtros, page, limit);

            //return res.status(200).json(consultas);
            return res.status(200).json({
                dados: consultas.registros,
                paginacao: {
                    paginaAtual: page,
                    limit,
                    totalRegistros: consultas.total,
                    totalPaginas: Math.ceil(consultas.total / limit)
                }
            });

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao listar consultas.', {
                erro: error instanceof Error ? error.stack : String(error)
            });            

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

            //console.error('Erro ao buscar consulta:', erro);
            logger.error('Erro ao buscar consulta.', {
                erro: erro instanceof Error ? erro.stack : String(erro)
            });

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

            logger.info('Atendimento realizado com sucesso.', {
                consultaId: consulta.id
            });

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

            //console.error(error);
            logger.error('Erro ao realizar atendimento.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

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

            logger.info('Consulta cancelada com sucesso.', {
                consultaId: consulta.id
            });

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

            //console.error(error);
            logger.error('Erro ao cancelar consulta.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                erro: 'Erro interno ao cancelar consulta.'
            });
        }
    }

    async relatorioPorStatus(req: Request, res: Response): Promise<Response> {
        try {
            const resultado = await this.consultaService.relatorioPorStatus();

            return res.status(200).json(resultado);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao gerar relatório de consultas por status.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                mensagem: 'Erro interno ao gerar relatório de consultas por status.'
            });
        }
    }

    async relatorioPorMedico(req: Request, res: Response): Promise<Response> {
        try {
            const resultado = await this.consultaService.relatorioPorMedico();

            return res.status(200).json(resultado);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao gerar relatório de consultas por médico.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                mensagem: 'Erro interno ao gerar relatório de consultas por médico.'
            });
        }
    }

    async relatorioPacientesAgendados(req: Request, res: Response): Promise<Response> {
        try {
            const resultado = await this.consultaService.relatorioPacientesAgendados();

            return res.status(200).json(resultado);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao gerar relatório de pacientes com consultas agendadas.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                mensagem: 'Erro interno ao gerar relatório de pacientes com consultas agendadas.'
            });
        }
    }

}