import { Request, Response } from 'express';
import { PacienteService } from '../services/pacienteService';
import { AppError } from '../utils/appError';

export class PacienteController {

    private service = new PacienteService();

    /* async listar(req: Request, res: Response): Promise<void> {
        try {
            const pacientes = await this.service.listar();
            res.status(200).json(pacientes);
        } catch (error) {
            this.tratarErro(error, res);
        }
    } */
    /* async listar(req: Request, res: Response): Promise<Response> {
        try {
            const filtros = {
                nome: req.query.nome as string
            };

            const pacientes = await this.service.listar(filtros);

            return res.status(200).json(pacientes);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                mensagem: 'Erro interno ao listar pacientes.'
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
                nome: req.query.nome as string
            };

            const resultado = await this.service.listar(filtros, page, limit);

            return res.status(200).json({
                dados: resultado.registros,
                paginacao: {
                    paginaAtual: page,
                    limit,
                    totalRegistros: resultado.total,
                    totalPaginas: Math.ceil(resultado.total / limit)
                }
            });

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                mensagem: 'Erro interno ao listar pacientes.'
            });
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