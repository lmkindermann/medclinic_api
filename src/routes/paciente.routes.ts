
import { Router } from 'express';
import { PacienteController } from '../controllers/pacienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { UsuarioRole } from '../entities/user';

const pacienteRoutes = Router();
const pacienteController = new PacienteController();

// Todas as rotas exigem autenticação
pacienteRoutes.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gerenciamento de pacientes
 */

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Listar pacientes
 *     description: Retorna os pacientes cadastrados com filtro por nome e paginação. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra pacientes pelo nome.
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
 *         description: Lista de pacientes retornada com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               dados:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   nome: Maria da Silva
 *                   cpf: "12345678901"
 *                   dataNascimento: "1990-05-20"
 *                   email: maria@email.com
 *                   telefone: "48999998888"
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
pacienteRoutes.get(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.listar(req, res)
);

/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     summary: Buscar paciente por ID
 *     description: Retorna os dados de um paciente específico. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do paciente.
 *     responses:
 *       200:
 *         description: Paciente encontrado.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Maria da Silva
 *               cpf: "12345678901"
 *               dataNascimento: "1990-05-20"
 *               email: maria@email.com
 *               telefone: "48999998888"
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Paciente não encontrado.
 */
pacienteRoutes.get(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.buscarPorId(req, res)
);

/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Cadastrar paciente
 *     description: Cadastra um novo paciente. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Pacientes]
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
 *               - cpf
 *               - dataNascimento
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria da Silva
 *               cpf:
 *                 type: string
 *                 example: "12345678901"
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@email.com
 *               telefone:
 *                 type: string
 *                 nullable: true
 *                 example: "48999998888"
 *     responses:
 *       201:
 *         description: Paciente cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Maria da Silva
 *               cpf: "12345678901"
 *               dataNascimento: "1990-05-20"
 *               email: maria@email.com
 *               telefone: "48999998888"
 *       400:
 *         description: Dados inválidos ou CPF já cadastrado.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 */
pacienteRoutes.post(
    '/',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.criar(req, res)
);

/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     summary: Atualizar paciente
 *     description: Atualiza os dados de um paciente. Acesso permitido a ADMIN e ATENDENTE.
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do paciente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria da Silva
 *               cpf:
 *                 type: string
 *                 example: "12345678901"
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@email.com
 *               telefone:
 *                 type: string
 *                 nullable: true
 *                 example: "48999998888"
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               nome: Maria da Silva
 *               cpf: "12345678901"
 *               dataNascimento: "1990-05-20"
 *               email: maria@email.com
 *               telefone: "48999998888"
 *       400:
 *         description: Dados inválidos ou CPF já cadastrado.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão.
 *       404:
 *         description: Paciente não encontrado.
 */
pacienteRoutes.put(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN, UsuarioRole.ATENDENTE),
    (req, res) => pacienteController.atualizar(req, res)
);

/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     summary: Excluir paciente
 *     description: Exclui um paciente. Acesso exclusivo de ADMIN.
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID do paciente.
 *     responses:
 *       204:
 *         description: Paciente excluído com sucesso. Sem conteúdo na resposta.
 *       401:
 *         description: Token ausente ou inválido.
 *       403:
 *         description: Usuário sem permissão de administrador.
 *       404:
 *         description: Paciente não encontrado.
 */
pacienteRoutes.delete(
    '/:id',
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => pacienteController.excluir(req, res)
);

export default pacienteRoutes;