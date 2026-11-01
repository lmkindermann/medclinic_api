
import { Request, Response } from 'express';
import { EspecialidadeService } from '../services/especialidadeService';
import { AppError } from '../utils/appError';

export class EspecialidadeController {
    private service = new EspecialidadeService();

    // GET /especialidades
    async listar(req: Request, res: Response): Promise<Response> {
        try {
            const especialidades = await this.service.listar();
            return res.status(200).json(especialidades);
        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // GET /especialidades/:id
    async buscarPorId(req: Request, res: Response): Promise<Response> {
        try {
            const especialidade = await this.service.buscarPorId(String(req.params.id));
            return res.status(200).json(especialidade);
        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // POST /especialidades
    async criar(req: Request, res: Response): Promise<Response> {
        try {
            const especialidade = await this.service.criar(req.body);
            return res.status(201).json(especialidade);
        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // PUT /especialidades/:id
    async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const especialidade = await this.service.atualizar(
                String(req.params.id),
                req.body
            );

            return res.status(200).json(especialidade);
        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // DELETE /especialidades/:id
    async excluir(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.excluir(String(req.params.id));
            return res.status(204).send();
        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    private tratarErro(error: unknown, res: Response): Response {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                erro: error.message
            });
        }

        console.error('Erro no EspecialidadeController:', error);

        return res.status(500).json({
            erro: 'Erro interno do servidor.'
        });
    }
}
