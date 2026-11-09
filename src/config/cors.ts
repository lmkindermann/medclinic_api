
import cors from 'cors';

export function getCorsOptions(): cors.CorsOptions {
    const allowedOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => origin.length > 0);

    return {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
}
