
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';
import logger from '../config/logger';

export const errorMiddleware: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError) {
        logger.warn('Erro controlado pela aplicação.', {
            mensagem: err.message,
            statusCode: err.statusCode,
            metodo: req.method,
            rota: req.originalUrl
        });

        res.status(err.statusCode).json({
            erro: err.message
        });

        return;
    }

    logger.error('Erro interno não tratado.', {
        mensagem: err.message,
        stack: err.stack,
        metodo: req.method,
        rota: req.originalUrl
    });

    res.status(500).json({
        erro: 'Erro interno do servidor.'
    });
};
