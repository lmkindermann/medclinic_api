import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

// Carrega as variáveis de ambiente antes de configurar o logger.
dotenv.config();

// Garante que o diretório de logs exista.
const logDirectory = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',

    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),

    transports: [
        // Exibição dos registros no console.
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, stack }) => {
                    return `${timestamp} [${level}]: ${stack || message}`;
                })
            )
        }),

        // Arquivo com todos os registros.
        new transports.File({
            filename: path.join(logDirectory, 'combined.log')
        }),

        // Arquivo exclusivo para erros.
        new transports.File({
            filename: path.join(logDirectory, 'error.log'),
            level: 'error'
        })
    ]
});

export default logger;