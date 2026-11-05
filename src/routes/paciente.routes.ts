import { Router } from 'express';
import { PacienteController } from '../controllers/pacienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

// Todas as rotas exigem autenticação
pacienteRoutes.use(authMiddleware);

// Listar pacientes
pacienteRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.listar(req, res)
);

// Consultar paciente por ID
pacienteRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.buscarPorId(req, res)
);

// Cadastrar paciente
pacienteRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.criar(req, res)
);

// Atualizar paciente
pacienteRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.atualizar(req, res)
);

// Excluir paciente
pacienteRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => pacienteController.excluir(req, res)
);

export default pacienteRoutes;