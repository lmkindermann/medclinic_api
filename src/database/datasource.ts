import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
//import { Usuario } from './entities/Usuario'
//import { Paciente } from './entities/Paciente'
//import { Medico } from './entities/Medico'
//import { Consulta } from './entities/Consulta'

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    synchronize: true,
    logging: false
    //entities: [Usuario, Paciente, Medico, Consulta]
})