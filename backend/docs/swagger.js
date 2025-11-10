// src/docs/swagger.js
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
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário',
              example: '123456789'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'usuario@exemplo.com'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        Board: {
          type: 'object',
          required: ['title', 'userId'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do quadro',
              example: 'board_123'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário',
              example: 'user_123'
            },
            title: {
              type: 'string',
              description: 'Título do quadro',
              example: 'Projeto Marketing'
            },
            lists: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/List'
              },
              description: 'Listas do quadro'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do quadro',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        List: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único da lista',
              example: 'list_123'
            },
            title: {
              type: 'string',
              description: 'Título da lista',
              example: 'A Fazer'
            },
            tasks: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Task'
              },
              description: 'Tarefas da lista'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da lista',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único da tarefa',
              example: 'task_123'
            },
            title: {
              type: 'string',
              description: 'Título da tarefa',
              example: 'Reunião com cliente'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada da tarefa',
              example: 'Preparar apresentação para reunião'
            },
            deadline: {
              type: 'string',
              format: 'date',
              description: 'Prazo da tarefa (YYYY-MM-DD)',
              example: '2024-01-20'
            },
            responsible: {
              type: 'string',
              description: 'Responsável pela tarefa',
              example: 'João Silva'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed'],
              description: 'Status da tarefa',
              example: 'pending'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da tarefa',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        VerificationCode: {
          type: 'object',
          required: ['email', 'code', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email para verificação',
              example: 'usuario@exemplo.com'
            },
            code: {
              type: 'string',
              description: 'Código de 6 dígitos',
              example: '123456'
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'João Silva'
            },
            timestamp: {
              type: 'integer',
              description: 'Timestamp de criação do código',
              example: 1705311000000
            }
          }
        },
        Statistics: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total de tarefas',
              example: 25
            },
            overdue: {
              type: 'integer',
              description: 'Tarefas atrasadas',
              example: 3
            },
            today: {
              type: 'integer',
              description: 'Tarefas que vencem hoje',
              example: 2
            },
            soon: {
              type: 'integer',
              description: 'Tarefas que vencem em até 3 dias',
              example: 5
            },
            completed: {
              type: 'integer',
              description: 'Tarefas concluídas',
              example: 10
            },
            pending: {
              type: 'integer',
              description: 'Tarefas pendentes',
              example: 15
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Mensagem de erro detalhada'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Quadro não encontrado'
              }
            }
          }
        },
        BadRequest: {
          description: 'Requisição inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Parâmetros obrigatórios faltando'
              }
            }
          }
        },
        ServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Erro interno do servidor'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './src/docs/*.js'] // Caminhos para os arquivos com anotações
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};