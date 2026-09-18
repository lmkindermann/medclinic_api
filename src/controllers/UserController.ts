import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AppDataSource } from "../database/datasource";
import { Usuario, UsuarioRole } from "../entities/user";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export class UserController {
  
  //GET /user/me
  async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.usuario?.id;
      const user = await usuarioRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { senha, ...userSemSenha } = user;
      return res.status(200).json(userSemSenha);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}