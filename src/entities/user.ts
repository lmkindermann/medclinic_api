import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from 'typeorm';

//Enum para representar as categorias (roles) dos usuários
export enum UsuarioRole {
    ATENDENTE = 'ATENDENTE',
    ADMIN = 'ADMIN'
}

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar")
    nome!: string;

    @Column("varchar")
    email!: string;

    @Column("varchar")
    senha!: string;
    //Banco de dados armazena a hash da senha, não a senha em si

    @Column({
        type: "enum",
        enum: UsuarioRole,
        default: UsuarioRole.ATENDENTE
    })
    categoria!: UsuarioRole;

    @CreateDateColumn()
    criadoEm!: Date;    
}