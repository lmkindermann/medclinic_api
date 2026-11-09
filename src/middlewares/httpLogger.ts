import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function httpLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const inicio = Date.now();

    res.on('finish', () => {
        const tempoResposta = Date.now() - inicio;

        // Utiliza o caminho sem os parâmetros da query string.
        const rota = req.route
            ? `${req.baseUrl}${req.route.path}`
            : req.path;

        logger.info('Requisição HTTP', {
            metodo: req.method,
            rota,
            status: res.statusCode,
            tempoResposta: `${tempoResposta}ms`
        });
    });

    next();
}