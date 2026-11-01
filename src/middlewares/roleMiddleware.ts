import { Response, NextFunction } from "express"
import { AuthenticatedRequest } from './authMiddleware';
import { UsuarioRole } from "../entities/user"

export function roleMiddleware(...rolesPermitidas: UsuarioRole[]){
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if(!req.usuario){
            return res.status(401).json({erro: "Não autenticado"})
        }

        if(!rolesPermitidas.includes(req.usuario.role)){
            return res.status(403).json({erro: "Você não tem permissão para acessar este recurso"})
        }

        return next()
    }
}

/* export function roleMiddleware(...rolesPermitidas: UsuarioRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        const usuario = req.usuario;

        if (!usuario) {
            return res.status(401).json({ erro: "Não autenticado" });
        }

        const permitido = rolesPermitidas.includes(usuario.role);

        console.log("DEBUG - Verificação:", {
            role: usuario.role,
            rolesPermitidas,
            permitido
        });

        if (!permitido) {
            return res.status(403).json({
                erro: "Você não tem permissão para acessar este recurso"
            });
        }

        return next();
    };
} */
