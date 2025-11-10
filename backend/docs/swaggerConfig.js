// src/docs/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API completa para gerenciamento de tarefas com autenticação por email',
      contact: {
        name: 'Suporte API',
        email: 'suporte@taskmanager.com'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://sua-api-producao.com',
        description: 'Servidor de Produção'
      }
    ]
  },
  apis: ['./docs/swaggerDefinitions.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};