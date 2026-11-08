import { Router } from "express"
import { AuthController } from "../controllers/AuthController"

const authRoutes = Router()
const authController = new AuthController()

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Cadastro de usuários e autenticação na API
 */

/**
 * @swagger
 * /auth/register/user:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Autenticação]
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha123
 *             required:
 *               - nome
 *               - email
 *               - senha
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: "1"
 *               nome: João da Silva
 *               email: joao@email.com
 *               categoria: ATENDENTE
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.post("/register/user", (req, res) => authController.registrarUsuario(req, res))

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: Senha123
 *             required:
 *               - email
 *               - senha
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiJ9..."
 *               usuario:
 *                 id: "1"
 *                 nome: João da Silva
 *                 email: joao@email.com
 *                 categoria: ATENDENTE
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.post("/login", (req, res) => authController.login(req, res))

export default authRoutes
