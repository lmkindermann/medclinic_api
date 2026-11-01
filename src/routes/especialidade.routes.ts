
import { Router } from 'express';
import { EspecialidadeController } from '../controllers/especialidadeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const especialidadeRoutes = Router();
const especialidadeController = new EspecialidadeController();

// Todas as rotas exigem autenticação
especialidadeRoutes.use(authMiddleware);

// Consultas: Administrador e Atendente
especialidadeRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => especialidadeController.listar(req, res)
);

especialidadeRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => especialidadeController.buscarPorId(req, res)
);

// Escrita: somente Administrador
especialidadeRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => especialidadeController.criar(req, res)
);

especialidadeRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => especialidadeController.atualizar(req, res)
);

especialidadeRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => especialidadeController.excluir(req, res)
);

export default especialidadeRoutes;
