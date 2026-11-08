
import { Router } from 'express';
import { ConsultaController } from '../controllers/consultaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const consultaRoutes = Router();
const consultaController = new ConsultaController();

// Todas as rotas exigem autenticação
consultaRoutes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Gerenciamento de agendamentos e atendimentos
 */

/**
 * @swagger
 * /consultas:
 *   get:
 *     summary: Listar consultas
 *     description: Retorna as consultas cadastradas, permitindo filtros por período, status, médico e paciente, além de paginação. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicial
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período de consultas.
 *       - in: query
 *         name: dataFinal
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período de consultas. Quando informada apenas a data, considera o final daquele dia.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AGENDADA, REALIZADA, CANCELADA]
 *         description: Filtra pelo status da consulta.
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador do médico.
 *       - in: query
 *         name: pacienteId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador do paciente.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número da página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Quantidade de registros por página.
 *     responses:
 *       200:
 *         description: Consultas retornadas com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               dados:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   dataHora: "2027-05-20T14:00:00.000Z"
 *                   status: AGENDADA
 *                   observacoes: null
 *                   medico:
 *                     id: "660e8400-e29b-41d4-a716-446655440000"
 *                     nome: João da Silva
 *                   paciente:
 *                     id: "770e8400-e29b-41d4-a716-446655440000"
 *                     nome: Maria da Silva
 *               paginacao:
 *                 paginaAtual: 1
 *                 limit: 10
 *                 totalRegistros: 1
 *                 totalPaginas: 1
 *       400:
 *         description: Filtros de data, status ou paginação inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 */
consultaRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.listar(req, res)
);

/**
 * @swagger
 * /consultas/{id}:
 *   get:
 *     summary: Buscar consulta por ID
 *     description: Retorna os dados de uma consulta específica. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da consulta.
 *     responses:
 *       200:
 *         description: Consulta encontrada.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               dataHora: "2027-05-20T14:00:00.000Z"
 *               status: AGENDADA
 *               observacoes: null
 *               medico:
 *                 id: "660e8400-e29b-41d4-a716-446655440000"
 *                 nome: João da Silva
 *               paciente:
 *                 id: "770e8400-e29b-41d4-a716-446655440000"
 *                 nome: Maria da Silva
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Consulta não encontrada.
 */
consultaRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.buscarPorId(req, res)
);

/**
 * @swagger
 * /consultas:
 *   post:
 *     summary: Agendar consulta
 *     description: Agenda uma consulta para um médico e paciente existentes. A data e hora devem ser futuras e não pode haver outra consulta agendada para o mesmo médico naquele horário. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicoId
 *               - pacienteId
 *               - dataHora
 *             properties:
 *               medicoId:
 *                 type: string
 *                 format: uuid
 *                 example: "660e8400-e29b-41d4-a716-446655440000"
 *               pacienteId:
 *                 type: string
 *                 format: uuid
 *                 example: "770e8400-e29b-41d4-a716-446655440000"
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-05-20T14:00:00.000Z"
 *     responses:
 *       201:
 *         description: Consulta agendada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Consulta agendada com sucesso.
 *               consulta:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 dataHora: "2027-05-20T14:00:00.000Z"
 *                 status: AGENDADA
 *                 observacoes: null
 *       400:
 *         description: Campos obrigatórios ausentes, data/hora inválida ou data/hora não futura.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Médico ou paciente não encontrado.
 *       409:
 *         description: Médico já possui consulta agendada nesse horário.
 */
consultaRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.agendar(req, res)
);

/**
 * @swagger
 * /consultas/{id}/atendimento:
 *   patch:
 *     summary: Realizar atendimento
 *     description: Registra o atendimento e suas observações, alterando o status da consulta para REALIZADA. Somente consultas AGENDADAS podem ser atendidas. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da consulta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - observacoes
 *             properties:
 *               observacoes:
 *                 type: string
 *                 example: Paciente apresentou melhora após o tratamento.
 *     responses:
 *       200:
 *         description: Atendimento realizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Atendimento realizado com sucesso.
 *               consulta:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 status: REALIZADA
 *                 observacoes: Paciente apresentou melhora após o tratamento.
 *       400:
 *         description: Consulta não está agendada ou observações não foram informadas.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Consulta não encontrada.
 */
consultaRoutes.patch(
    '/:id/atendimento',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.realizarAtendimento(req, res)
);

/**
 * @swagger
 * /consultas/{id}/cancelamento:
 *   patch:
 *     summary: Cancelar consulta
 *     description: Altera o status da consulta para CANCELADA. Somente consultas AGENDADAS podem ser canceladas. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Consultas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da consulta.
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Consulta cancelada com sucesso.
 *               consulta:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 status: CANCELADA
 *       400:
 *         description: Somente consultas agendadas podem ser canceladas.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Consulta não encontrada.
 */
consultaRoutes.patch(
    '/:id/cancelamento',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => consultaController.cancelar(req, res)
);

export default consultaRoutes;