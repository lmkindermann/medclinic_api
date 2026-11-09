import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../config/logger';

dotenv.config();

const globalWindowMs = Number(
    process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
);

const globalMax = Number(
    process.env.RATE_LIMIT_MAX || 100
);

const authWindowMs = Number(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
);

const authMax = Number(
    process.env.AUTH_RATE_LIMIT_MAX || 5
);

function createRateLimitHandler(tipo: string) {
    return (req: Request, res: Response) => {
        logger.warn('Limite de requisições excedido.', {
            tipo,
            ip: req.ip,
            metodo: req.method,
            rota: req.originalUrl
        });

        res.status(429).json({
            erro: 'Limite de requisições excedido. Tente novamente mais tarde.'
        });
    };
}

export const rateLimiter = rateLimit({
    windowMs: globalWindowMs,
    limit: globalMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: createRateLimitHandler('global')
});

export const authRateLimiter = rateLimit({
    windowMs: authWindowMs,
    limit: authMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: createRateLimitHandler('autenticacao')
});
