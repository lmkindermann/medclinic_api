import { AppDataSource } from "../database/datasource";
import { Usuario, UsuarioRole } from "../entities/user";
import {Request, Response} from "express"
import bcrypt from "bcryptjs"
import { gerarToken } from "../utils/jwt";

const usuarioRepository = AppDataSource.getRepository(Usuario)

export class AuthController{
    
    //POST /auth/register/user
    async registrarUsuario(req: Request, res: Response){
        const { nome, email, senha, categoria, dataNascimento } = req.body

        if(!nome || !email || !senha){
            return res.status(400).json({erro: "nome, email e senha são obrigatórios."})
        }

        const emailExiste = await usuarioRepository.findOneBy({email})
        if(emailExiste){
            return res.status(400).json({erro: "E-mail já cadastrado"})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const usuario = usuarioRepository.create({
            nome,
            email,
            senha: senhaHash,
            categoria: UsuarioRole.PACIENTE
        })

        await usuarioRepository.save(usuario)

        return res.status(201).json({
            nome: usuario.nome,
            email: usuario.email,
            categoria: usuario.categoria
        })
    }

    //POST /auth/login
    async login(req: Request, res: Response){
        const { email, senha } = req.body

        if(!email || !senha){
            return res.status(400).json({erro: "email, senha são obrigatórios."})
        }

        const usuario = await usuarioRepository.findOneBy({email})
        if(!usuario){
            return res.status(401).json({erro: "Credenciais Inválidas"})
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if(!senhaCorreta){
            return res.status(401).json({erro: "Credenciais Inválidas"})
        }

        const token = gerarToken({sub: usuario.id, role: usuario.categoria})

        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                categoria: usuario.categoria
            }
        })
    }

}