
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

/**
 * @swagger
 * tags:
 *   name: Relatórios
 *   description: Relatórios gerenciais da clínica
 */

/**
 * @swagger
 * /relatorios/consultas/status:
 *   get:
 *     summary: Relatório de consultas por status
 *     description: Retorna a quantidade de consultas agrupadas por status. Acesso exclusivo de ADMIN.
 *     tags: [Relatórios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - status: AGENDADA
 *                 total: 12
 *               - status: REALIZADA
 *                 total: 25
 *               - status: CANCELADA
 *                 total: 3
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 *       500:
 *         description: Erro interno ao gerar relatório.
 */
relatorioRoutes.get(
    '/consultas/status',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPorStatus(req, res)
);

/**
 * @swagger
 * /relatorios/consultas/medicos:
 *   get:
 *     summary: Relatório de consultas por médico
 *     description: Retorna a quantidade de consultas associadas a cada médico, em ordem alfabética. Acesso exclusivo de ADMIN.
 *     tags: [Relatórios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - medicoId: "660e8400-e29b-41d4-a716-446655440000"
 *                 nome: João da Silva
 *                 total: 15
 *               - medicoId: "880e8400-e29b-41d4-a716-446655440000"
 *                 nome: Ana Souza
 *                 total: 8
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 *       500:
 *         description: Erro interno ao gerar relatório.
 */
relatorioRoutes.get(
    '/consultas/medicos',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPorMedico(req, res)
);

/**
 * @swagger
 * /relatorios/medicos/especialidades:
 *   get:
 *     summary: Relatório de médicos por especialidade
 *     description: Retorna a quantidade de médicos cadastrados em cada especialidade, incluindo especialidades sem médicos. Acesso exclusivo de ADMIN.
 *     tags: [Relatórios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - especialidadeId: "990e8400-e29b-41d4-a716-446655440000"
 *                 nome: Cardiologia
 *                 total: 5
 *               - especialidadeId: "aa0e8400-e29b-41d4-a716-446655440000"
 *                 nome: Dermatologia
 *                 total: 0
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 *       500:
 *         description: Erro interno ao gerar relatório.
 */
relatorioRoutes.get(
    '/medicos/especialidades',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => especialidadeController.relatorioPorMedico(req, res)
);

/**
 * @swagger
 * /relatorios/pacientes/agendados:
 *   get:
 *     summary: Relatório de pacientes com consultas agendadas
 *     description: Retorna os pacientes que possuem consultas com status AGENDADA e a quantidade de consultas de cada um, em ordem alfabética. Acesso exclusivo de ADMIN.
 *     tags: [Relatórios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               - pacienteId: "770e8400-e29b-41d4-a716-446655440000"
 *                 nome: Maria da Silva
 *                 total: 2
 *               - pacienteId: "bb0e8400-e29b-41d4-a716-446655440000"
 *                 nome: Pedro Santos
 *                 total: 1
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Acesso restrito a administradores.
 *       500:
 *         description: Erro interno ao gerar relatório.
 */
relatorioRoutes.get(
    '/pacientes/agendados',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => consultaController.relatorioPacientesAgendados(req, res)
);

export default relatorioRoutes;