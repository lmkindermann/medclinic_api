import swaggerJsdoc = require('swagger-jsdoc');
import path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MedClinic API',
            version: '1.0.0',
            description: 'API para gerenciamento de uma clínica médica.',
        },
        servers: [
            {
                url: 'http://localhost:3333',
                description: 'Servidor local de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Informe o token JWT obtido no login.',
                },
            },
        },
    },
    /* apis: [
        path.join(__dirname, '../routes/*.ts'),
        path.join(__dirname, '../routes/*.js'),
    ], */
    apis: [
        path.resolve(process.cwd(), 'src/routes/*.ts').replace(/\\/g, '/'),
        path.resolve(process.cwd(), 'dist/routes/*.js').replace(/\\/g, '/'),
    ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;