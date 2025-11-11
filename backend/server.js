// TOPO DO ARQUIVO - Primeiras linhas
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/boards');
const listRoutes = require('./routes/lists');
const taskRoutes = require('./routes/tasks');
const statisticsRoutes = require('./routes/statistics');

// Importar Swagger
const { specs, swaggerUi } = require('./docs/swaggerConfig');

const app = express();

// Usar PORT do environment ou 3000 como fallback
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/boards', listRoutes);
app.use('/api/boards', taskRoutes);
app.use('/api/statistics', statisticsRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Manager API Documentation'
}));

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à Task Manager API!',
    documentation: `http://localhost:${PORT}/api-docs`,
    health: `http://localhost:${PORT}/api/health`
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  // Conectar ao MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`📚 Docs disponível em http://localhost:${PORT}/api/docs`);
  console.log(`${'='.repeat(50)}\n`);
});