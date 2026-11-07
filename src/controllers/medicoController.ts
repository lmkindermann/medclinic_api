import { Request, Response } from 'express';
import { MedicoService } from '../services/medicoService';
import { AppError } from '../utils/appError';

export class MedicoController {

    private service = new MedicoService();

    // Listar médicos
    /* async listar(req: Request, res: Response): Promise<Response> {
        try {
            const medicos = await this.service.listar();

            return res.status(200).json(medicos);

        } catch (error) {
            return this.tratarErro(error, res);
        }
    } */
    async listar(req: Request, res: Response): Promise<Response> {
        try {
            const filtros = {
                nome: req.query.nome as string,
                especialidadeId: req.query.especialidadeId as string
            };

            const medicos = await this.service.listar(filtros);

            return res.status(200).json(medicos);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    mensagem: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                mensagem: 'Erro interno ao listar médicos.'
            });
        }
    }

    // Buscar médico por ID
    async buscarPorId(req: Request, res: Response): Promise<Response> {
        try {
            const medico = await this.service.buscarPorId(
                String(req.params.id)
            );

            return res.status(200).json(medico);

        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // Cadastrar médico
    async criar(req: Request, res: Response): Promise<Response> {
        try {
            const medico = await this.service.criar(req.body);

            return res.status(201).json(medico);

        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // Atualizar médico
    async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const medico = await this.service.atualizar(
                String(req.params.id),
                req.body
            );

            return res.status(200).json(medico);

        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // Excluir médico
    async excluir(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.excluir(String(req.params.id));

            return res.status(204).send();

        } catch (error) {
            return this.tratarErro(error, res);
        }
    }

    // Tratamento centralizado de erros
    private tratarErro(error: unknown, res: Response): Response {

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                erro: error.message
            });
        }

        console.error('Erro no MedicoController:', error);

        return res.status(500).json({
            erro: 'Erro interno do servidor.'
        });
    }
}