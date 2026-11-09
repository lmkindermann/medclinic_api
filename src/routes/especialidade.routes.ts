
import { Router } from 'express';
import { EspecialidadeController } from '../controllers/especialidadeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const especialidadeRoutes = Router();
const especialidadeController = new EspecialidadeController();

// Todas as rotas exigem autenticação
especialidadeRoutes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gerenciamento de especialidades médicas
 */

/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar especialidades
 *     description: Retorna as especialidades cadastradas com paginação. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Especialidades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *         description: Lista de especialidades retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               dados:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   nome: Cardiologia
 *                   descricao: Especialidade voltada ao sistema cardiovascular.
 *               paginacao:
 *                 paginaAtual: 1
 *                 limite: 10
 *                 totalRegistros: 1
 *                 totalPaginas: 1
 *       400:
 *         description: Parâmetros de paginação inválidos.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 */
especialidadeRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    //(req, res) => especialidadeController.listar(req, res)
    (req, res, next) => especialidadeController.listar(req, res, next)
);

/**
 * @swagger
 * /especialidades/{id}:
 *   get:
 *     summary: Buscar especialidade por ID
 *     description: Retorna os dados de uma especialidade específica. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Especialidades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da especialidade.
 *     responses:
 *       200:
 *         description: Especialidade encontrada.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Cardiologia
 *               descricao: Especialidade voltada ao sistema cardiovascular.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Especialidade não encontrada.
 */
especialidadeRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    //(req, res) => especialidadeController.buscarPorId(req, res)
    (req, res, next) => especialidadeController.buscarPorId(req, res, next)
);

/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Cadastrar especialidade
 *     description: Cadastra uma nova especialidade. Acesso exclusivo de ADMIN.
 *     tags: [Especialidades]
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
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Cardiologia
 *               descricao:
 *                 type: string
 *                 nullable: true
 *                 example: Especialidade voltada ao sistema cardiovascular.
 *     responses:
 *       201:
 *         description: Especialidade cadastrada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Cardiologia
 *               descricao: Especialidade voltada ao sistema cardiovascular.
 *       400:
 *         description: Dados inválidos ou nome já cadastrado.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 */
especialidadeRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => especialidadeController.criar(req, res)
    (req, res, next) => especialidadeController.criar(req, res, next)
);

/**
 * @swagger
 * /especialidades/{id}:
 *   put:
 *     summary: Atualizar especialidade
 *     description: Atualiza os dados de uma especialidade. Acesso exclusivo de ADMIN.
 *     tags: [Especialidades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da especialidade.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Neurologia
 *               descricao:
 *                 type: string
 *                 nullable: true
 *                 example: Especialidade voltada ao sistema nervoso.
 *     responses:
 *       200:
 *         description: Especialidade atualizada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Neurologia
 *               descricao: Especialidade voltada ao sistema nervoso.
 *       400:
 *         description: Dados inválidos ou nome já cadastrado.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Especialidade não encontrada.
 */
especialidadeRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => especialidadeController.atualizar(req, res)
    (req, res, next) => especialidadeController.atualizar(req, res, next)
);

/**
 * @swagger
 * /especialidades/{id}:
 *   delete:
 *     summary: Excluir especialidade
 *     description: Exclui uma especialidade. Acesso exclusivo de ADMIN.
 *     tags: [Especialidades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID da especialidade.
 *     responses:
 *       204:
 *         description: Especialidade excluída com sucesso. Sem conteúdo na resposta.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Especialidade não encontrada.
 */
especialidadeRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    //(req, res) => especialidadeController.excluir(req, res)
    (req, res, next) => especialidadeController.excluir(req, res, next)
);

export default especialidadeRoutes;