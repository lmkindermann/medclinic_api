import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './database/datasource';
import routes from './routes';
import swaggerUi = require('swagger-ui-express');
import swaggerSpec from './config/swagger';
import logger from './config/logger';
import { httpLogger } from './middlewares/httpLogger';
import cors from 'cors';
import { rateLimiter } from './middlewares/rateLimiter';

dotenv.config();

const app = express();

//logger.info('Logger Winston inicializado.');
//logger.warn('Mensagem de teste do nível warning.');
//logger.error('Mensagem de teste do nível error.');
app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use(httpLogger);

const PORT = process.env.PORT || 3333;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

AppDataSource.initialize()
  .then(() => {
    //console.log('Conexão com o banco de dados estabelecida com sucesso!');
    logger.info('Conexão com o banco de dados estabelecida com sucesso.');
    app.listen(PORT, () => {
      //console.log(`Servidor rodando na porta ${PORT}`);
      logger.info(`Servidor rodando na porta ${PORT}.`);
    });
  })
  .catch((error) => {
    //console.error('Erro ao conectar com o banco de dados:', error);
    logger.error('Erro ao conectar com o banco de dados.', {
        erro: error instanceof Error ? error.stack : String(error)
    });
  });