import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AppDataSource } from "../database/datasource";
import { Usuario } from "../entities/user";
import { AppError } from '../utils/appError';

const usuarioRepository = AppDataSource.getRepository(Usuario);

export class UserController {

    // GET /user/me
    async me(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.usuario?.id;

            const user = await usuarioRepository.findOne({
                where: { id: userId }
            });

            if (!user) {
                throw new AppError('Usuário não encontrado.', 404);
            }

            const { senha, ...userSemSenha } = user;

            res.status(200).json(userSemSenha);

        } catch (error) {
            next(error);
        }
    }
}