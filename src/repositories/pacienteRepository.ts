import { AppDataSource } from '../database/datasource';
import { Paciente } from '../entities/paciente';

export class PacienteRepository {

    private repository = AppDataSource.getRepository(Paciente);

    /* async listar(): Promise<Paciente[]> {
        return this.repository.find({
            order: {
                nome: 'ASC'
            }
        });
    } */
    async listar(filtros?: {
        nome?: string;
    }): Promise<Paciente[]> {

        const query = this.repository
            .createQueryBuilder('paciente');

        if (filtros?.nome) {
            query.andWhere('paciente.nome ILIKE :nome', {
                nome: `%${filtros.nome}%`
            });
        }

        return query
            .orderBy('paciente.nome', 'ASC')
            .getMany();
    }

    async buscarPorId(id: string): Promise<Paciente | null> {
        return this.repository.findOneBy({ id });
    }

    async buscarPorCPF(cpf: string): Promise<Paciente | null> {
        return this.repository.findOneBy({ cpf });
    }

    async criar(dados: Partial<Paciente>): Promise<Paciente> {
        const paciente = this.repository.create(dados);
        return this.repository.save(paciente);
    }

    async atualizar(paciente: Paciente): Promise<Paciente> {
        return this.repository.save(paciente);
    }

    async excluir(paciente: Paciente): Promise<void> {
        await this.repository.remove(paciente);
    }
}