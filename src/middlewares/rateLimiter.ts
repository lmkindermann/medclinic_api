import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos
    limit: 100, // Máximo de 100 requisições por IP
    //limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        erro: 'Limite de requisições excedido. Tente novamente mais tarde.'
    }
});