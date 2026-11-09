import { Request, Response, NextFunction } from "express"
import { verificarToken, TokenPayload } from "../utils/jwt"
import logger from '../config/logger';

/* declare global {
    namespace Express {
        interface Request {
            usuario?: TokenPayload
        }
    }
} */

export interface AuthenticatedRequest extends Request {
  usuario?: TokenPayload;
}

//Request
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction){ 
    const authHeader = req.headers.authorization

    if (!authHeader) {
        logger.warn('Acesso não autenticado: token não informado.', {
            metodo: req.method,
            rota: req.originalUrl
        });

        return res.status(401).json({ erro: "Token não informado." });
    }

    const [scheme, token] = authHeader.split(" ")

    //Checar o formato Bearer <token>
    /* if (scheme !== "Bearer" || !token){
        return res.status(401).json({erro: "Token mal formatado."})
    } */
    if (scheme !== "Bearer" || !token) {
        logger.warn('Acesso não autenticado: token mal formatado.', {
            metodo: req.method,
            rota: req.originalUrl
        });

        return res.status(401).json({ erro: "Token mal formatado." });
    }

    try{
        const payload = verificarToken(token)
        req.usuario = payload
        return next()

    } catch (err) {
        logger.warn('Acesso não autenticado: token inválido ou expirado.', {
            metodo: req.method,
            rota: req.originalUrl
        });

        return res.status(401).json({ erro: "Token inválido ou expirado" });
    }
    
}