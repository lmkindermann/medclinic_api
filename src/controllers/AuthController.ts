import { AppDataSource } from "../database/datasource";
import { Usuario, UsuarioRole } from "../entities/user";
import {Request, Response, NextFunction} from "express"
import bcrypt from "bcryptjs"
import { gerarToken } from "../utils/jwt";
import logger from "../config/logger";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export class AuthController{
    
    //POST /auth/register/user
    /* async registrarUsuario(req: Request, res: Response){
        const { nome, email, senha, categoria, dataNascimento } = req.body

        if(!nome || !email || !senha){
            return res.status(400).json({erro: "nome, email e senha são obrigatórios."})
        }

        const emailExiste = await usuarioRepository.findOneBy({email})
        if(emailExiste){
            return res.status(400).json({erro: "E-mail já cadastrado"})
        }

        const emailFormatado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if(!emailFormatado){
            return res.status(400).json({erro: "E-mail inválido"})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuario = usuarioRepository.create({
            nome,
            email,
            senha: senhaHash,
            categoria: UsuarioRole.ATENDENTE
        })

        await usuarioRepository.save(usuario)
        logger.info('Usuário cadastrado com sucesso.', {
            categoria: usuario.categoria
        });

        return res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            categoria: usuario.categoria
        })
    } */
    async registrarUsuario(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {
                res.status(400).json({
                    erro: 'nome, email e senha são obrigatórios.'
                });
                return;
            }

            const emailFormatado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailFormatado) {
                res.status(400).json({ erro: 'E-mail inválido' });
                return;
            }

            const emailExiste = await usuarioRepository.findOneBy({ email });

            if (emailExiste) {
                res.status(400).json({ erro: 'E-mail já cadastrado' });
                return;
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = usuarioRepository.create({
                nome,
                email,
                senha: senhaHash,
                categoria: UsuarioRole.ATENDENTE
            });

            await usuarioRepository.save(usuario);

            logger.info('Usuário cadastrado com sucesso.', {
                categoria: usuario.categoria
            });

            res.status(201).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                categoria: usuario.categoria
            });

        } catch (error) {
            next(error);
        }
    }

    //POST /auth/login
    /* async login(req: Request, res: Response){
        const { email, senha } = req.body

        if(!email || !senha){
            return res.status(400).json({erro: "email, senha são obrigatórios."})
        }

        const usuario = await usuarioRepository.findOneBy({email})
        if(!usuario){
            logger.warn('Falha de autenticação: credenciais inválidas.');
            return res.status(401).json({erro: "Credenciais Inválidas"})
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if(!senhaCorreta){
            logger.warn('Falha de autenticação: credenciais inválidas.');
            return res.status(401).json({erro: "Credenciais Inválidas"})
        }

        const token = gerarToken({id: usuario.id, role: usuario.categoria})
        logger.info('Autenticação realizada com sucesso.', {
            categoria: usuario.categoria
        });

        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                categoria: usuario.categoria
            }
        })
    } */
    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(400).json({
                    erro: 'email e senha são obrigatórios.'
                });
                return;
            }

            const usuario = await usuarioRepository.findOneBy({ email });

            if (!usuario) {
                logger.warn('Falha de autenticação: credenciais inválidas.', {
                    metodo: req.method,
                    rota: req.originalUrl
                });

                res.status(401).json({ erro: 'Credenciais inválidas' });
                return;
            }

            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (!senhaCorreta) {
                logger.warn('Falha de autenticação: credenciais inválidas.', {
                    metodo: req.method,
                    rota: req.originalUrl
                });

                res.status(401).json({ erro: 'Credenciais inválidas' });
                return;
            }

            const token = gerarToken({
                id: usuario.id,
                role: usuario.categoria
            });

            logger.info('Autenticação realizada com sucesso.', {
                categoria: usuario.categoria
            });

            res.status(200).json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    categoria: usuario.categoria
                }
            });

        } catch (error) {
            next(error);
        }
    }

}