
import { Router } from 'express';
import { MedicoController } from '../controllers/medicoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const medicoRoutes = Router();
const medicoController = new MedicoController();

// Todas as rotas exigem autenticação
medicoRoutes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Médicos
 *   description: Gerenciamento de médicos
 */

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar médicos
 *     description: Retorna os médicos cadastrados com filtros e paginação. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Médicos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra médicos pelo nome.
 *       - in: query
 *         name: especialidadeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtra médicos pelo identificador da especialidade.
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
 *         description: Lista de médicos retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               dados:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   nome: João da Silva
 *                   crm: "123456"
 *                   especialidade:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     nome: Cardiologia
 *               paginacao:
 *                 paginaAtual: 1
 *                 limit: 10
 *                 totalRegistros: 1
 *                 totalPaginas: 1
 *       400:
 *         description: Parâmetros de paginação inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 */
medicoRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    //(req, res) => medicoController.listar(req, res)
    (req, res, next) => medicoController.listar(req, res, next)
);

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Buscar médico por ID
 *     description: Retorna os dados de um médico específico. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Médicos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do médico.
 *     responses:
 *       200:
 *         description: Médico encontrado.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: João da Silva
 *               crm: "123456"
 *               especialidade:
 *                 id: "550e8400-e29b-41d4-a716-446655440001"
 *                 nome: Cardiologia
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Médico não encontrado.
 */
medicoRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    //(req, res) => medicoController.buscarPorId(req, res)
    (req, res, next) => medicoController.buscarPorId(req, res, next)
);

/**
 * @swagger
 * /medicos:
 *   post:
 *     summary: Cadastrar médico
 *     description: Cadastra um novo médico. Acesso exclusivo de ADMIN.
 *     tags: [Médicos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - crm
 *               - especialidadeId
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               crm:
 *                 type: string
 *                 example: "123456"
 *               especialidadeId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Médico cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: João da Silva
 *               crm: "123456"
 *       400:
 *         description: Dados inválidos, CRM duplicado ou especialidade inexistente.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 */
medicoRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => medicoController.criar(req, res)
    (req, res, next) => medicoController.criar(req, res, next)
);

/**
 * @swagger
 * /medicos/{id}:
 *   put:
 *     summary: Atualizar médico
 *     description: Atualiza os dados de um médico. Acesso exclusivo de ADMIN.
 *     tags: [Médicos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do médico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               crm:
 *                 type: string
 *                 example: "654321"
 *               especialidadeId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Médico atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: João da Silva
 *               crm: "654321"
 *       400:
 *         description: Dados inválidos ou especialidade inexistente.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Médico não encontrado.
 */
medicoRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => medicoController.atualizar(req, res)
    (req, res, next) => medicoController.atualizar(req, res, next)
);

/**
 * @swagger
 * /medicos/{id}:
 *   delete:
 *     summary: Excluir médico
 *     description: Exclui um médico. Acesso exclusivo de ADMIN.
 *     tags: [Médicos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do médico.
 *     responses:
 *       204:
 *         description: Médico excluído com sucesso. Sem conteúdo na resposta.
 *       400:
 *         description: Não foi possível excluir o médico devido a vínculos existentes.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Médico não encontrado.
 */
medicoRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => medicoController.excluir(req, res)
    (req, res, next) => medicoController.excluir(req, res, next)
);

export default medicoRoutes;