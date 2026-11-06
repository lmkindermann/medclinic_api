import { Router } from 'express';
import { ConsultaController } from '../controllers/consultaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const consultaRoutes = Router();
const consultaController = new ConsultaController();

// Todas as rotas exigem autenticação
consultaRoutes.use(authMiddleware);

// ADMIN e ATENDENTE podem listar consultas
consultaRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.listar(req, res)
);

// ADMIN e ATENDENTE podem consultar uma consulta específica
consultaRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.buscarPorId(req, res)
);

// ADMIN e ATENDENTE podem realizar agendamentos
consultaRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.agendar(req, res)
);

export default consultaRoutes;