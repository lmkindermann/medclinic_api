import { Router } from 'express';
import { ConsultaController } from '../controllers/consultaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';
import { EspecialidadeController } from '../controllers/especialidadeController';

const relatorioRoutes = Router();
const consultaController = new ConsultaController();
const especialidadeController = new EspecialidadeController();

// Todas as rotas exigem autenticação
relatorioRoutes.use(authMiddleware);

// Somente ADMIN pode acessar os relatórios
relatorioRoutes.get(
    '/consultas/status',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPorStatus(req, res)
);

// Somente ADMIN pode acessar o relatório de consultas por médico
relatorioRoutes.get(
    '/consultas/medicos',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPorMedico(req, res)
);

// Somente ADMIN pode acessar o relatório de médicos por especialidade
relatorioRoutes.get(
    '/medicos/especialidades',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => especialidadeController.relatorioPorMedico(req, res)
);

// Somente ADMIN pode acessar o relatório de pacientes com consultas agendadas
relatorioRoutes.get(
    '/pacientes/agendados',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPacientesAgendados(req, res)
);

export default relatorioRoutes;