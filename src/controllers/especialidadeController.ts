import { Request, Response, NextFunction } from 'express';
import { EspecialidadeService } from '../services/especialidadeService';
import { AppError } from '../utils/appError';
//import logger from '../config/logger';

export class EspecialidadeController {
    private service = new EspecialidadeService();

    // GET /especialidades
    /* async listar(req: Request, res: Response): Promise<Response> {
        try {
            const especialidades = await this.service.listar();
            return res.status(200).json(especialidades);
        } catch (error) {
            return this.tratarErro(error, res);
        }
    } */
   //async listar(req: Request, res: Response): Promise<Response> {
   async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            //const page = Number(req.query.page) || 1;
            //const limit = Number(req.query.limit) || 10;
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

            const resultado = await this.service.listar(page, limit);

            //return res.status(200).json({
            res.status(200).json({
                dados: resultado.registros,
                paginacao: {
                    paginaAtual: page,
                    limite: limit,
                    totalRegistros: resultado.total,
                    totalPaginas: Math.ceil(resultado.total / limit)
                }
            });

        } catch (error) {
            /* if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao listar especialidades.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                mensagem: 'Erro interno ao listar especialidades.'
            }); */
            next(error);
        }
    }

    // GET /especialidades/:id
    //async buscarPorId(req: Request, res: Response): Promise<Response> {
    async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const especialidade = await this.service.buscarPorId(String(req.params.id));
            //return res.status(200).json(especialidade);
            res.status(200).json(especialidade);
        } catch (error) {
            //return this.tratarErro(error, res);
            next(error);
        }
    }

    // POST /especialidades
    //async criar(req: Request, res: Response): Promise<Response> {
    async criar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const especialidade = await this.service.criar(req.body);
            //return res.status(201).json(especialidade);
            res.status(201).json(especialidade);
        } catch (error) {
            //return this.tratarErro(error, res);
            next(error);
        }
    }

    // PUT /especialidades/:id
    //async atualizar(req: Request, res: Response): Promise<Response> {
    async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const especialidade = await this.service.atualizar(
                String(req.params.id),
                req.body
            );

            //return res.status(200).json(especialidade);
            res.status(200).json(especialidade);
        } catch (error) {
            //return this.tratarErro(error, res);
            next(error);
        }
    }

    // DELETE /especialidades/:id
    //async excluir(req: Request, res: Response): Promise<Response> {
    async excluir(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.service.excluir(String(req.params.id));
            //return res.status(204).send();
            res.status(204).send();
        } catch (error) {
            //return this.tratarErro(error, res);
            next(error);
        }
    }

    /* private tratarErro(error: unknown, res: Response): Response {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                erro: error.message
            });
        }

        //console.error('Erro no EspecialidadeController:', error);
        logger.error('Erro inesperado no EspecialidadeController.', {
            erro: error instanceof Error ? error.stack : String(error)
        });

        return res.status(500).json({
            erro: 'Erro interno do servidor.'
        });
    } */

    //async relatorioPorMedico(req: Request, res: Response): Promise<Response> {
    async relatorioPorMedico(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resultado = await this.service.relatorioPorMedico();

            //return res.status(200).json(resultado);
            res.status(200).json(resultado);

        } catch (error) {
            /* if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            //console.error(error);
            logger.error('Erro ao gerar relatório de médicos por especialidade.', {
                erro: error instanceof Error ? error.stack : String(error)
            });

            return res.status(500).json({
                mensagem: 'Erro interno ao gerar relatório de médicos por especialidade.'
            }); */
            next(error);
        }
    }

}
