import { Router } from 'express';
import { MedicoController } from '../controllers/medicoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const medicoRoutes = Router();
const medicoController = new MedicoController();

// Todas as rotas exigem autenticação
medicoRoutes.use(authMiddleware);

// Consultas: Administrador e Atendente
medicoRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => medicoController.listar(req, res)
);

medicoRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => medicoController.buscarPorId(req, res)
);

// Escrita: somente Administrador
medicoRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => medicoController.criar(req, res)
);

medicoRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => medicoController.atualizar(req, res)
);

medicoRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => medicoController.excluir(req, res)
);

export default medicoRoutes;