import jwt from 'jsonwebtoken'
import { UsuarioRole } from '../entities/user'

export interface TokenPayload {
    sub: string,
    role: UsuarioRole
}

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"

export function gerarToken(payload: TokenPayload): string{
    return jwt.sign(
        payload,
        JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        } as jwt.SignOptions
    )
}

export function verificarToken(token: string): TokenPayload{
    return jwt.verify(token, JWT_SECRET) as TokenPayload
}