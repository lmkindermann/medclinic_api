import { AppDataSource } from '../datasource';
import { Usuario, UsuarioRole } from '../../entities/user';
import bcrypt from 'bcryptjs';

async function createAdmin(): Promise<void> {
    try {
        const nome = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const senha = process.env.ADMIN_PASSWORD;

        if (!nome || !email || !senha) {
            throw new Error(
                'Variáveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias.'
            );
        }

        await AppDataSource.initialize();

        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Verifica se o e-mail já está cadastrado.
        const usuarioExistente = await usuarioRepository.findOneBy({ email });

        if (usuarioExistente) {
            if (usuarioExistente.categoria === UsuarioRole.ADMIN) {
                console.log('Este usuário ADMIN já está cadastrado.');
                return;
            }

            throw new Error(
                'O e-mail informado já pertence a um usuário ATENDENTE.'
            );
        }

        // Gera o hash da senha.
        const senhaHash = await bcrypt.hash(senha, 10);

        const admin = usuarioRepository.create({
            nome,
            email,
            senha: senhaHash,
            categoria: UsuarioRole.ADMIN
        });

        await usuarioRepository.save(admin);

        console.log('Usuário ADMIN criado com sucesso.');

    } catch (error) {
        console.error('Erro ao executar o seed:', error);
        process.exitCode = 1;

    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

createAdmin();