const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Banco de dados em memória
let users = [];
let boards = [];
let verificationCodes = {}; // { email: code }

// ========== AUTENTICAÇÃO ==========

// Gerar código de verificação
app.post('/api/auth/send-code', (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Email e nome são obrigatórios' });
  }

  // Gerar código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = { code, name, timestamp: Date.now() };

  console.log(`📧 Código gerado para ${email}: ${code}`);

  // Em produção, enviar email real aqui
  res.json({ 
    success: true, 
    message: 'Código enviado',
    code // REMOVER em produção! Só para desenvolvimento
  });
});

// Verificar código
app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email e código são obrigatórios' });
  }

  const storedData = verificationCodes[email];

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'Código não encontrado' });
  }

  // Verificar se código expirou (10 minutos)
  const isExpired = Date.now() - storedData.timestamp > 600000;
  if (isExpired) {
    delete verificationCodes[email];
    return res.status(400).json({ success: false, message: 'Código expirado' });
  }

  if (storedData.code !== code) {
    return res.status(400).json({ success: false, message: 'Código incorreto' });
  }

  // Criar ou buscar usuário
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: Date.now().toString(),
      email,
      name: storedData.name,
      createdAt: new Date().toISOString()
    };
    users.push(user);
  }

  // Limpar código usado
  delete verificationCodes[email];

  console.log(`✅ Usuário autenticado: ${email}`);

  res.json({ 
    success: true, 
    message: 'Login realizado com sucesso',
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// ========== QUADROS ==========

// Buscar todos os quadros do usuário
app.get('/api/boards', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId é obrigatório' });
  }

  const userBoards = boards.filter(b => b.userId === userId);
  res.json({ success: true, data: userBoards });
});

// Criar quadro
app.post('/api/boards', (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ success: false, message: 'userId e title são obrigatórios' });
  }

  const newBoard = {
    id: Date.now().toString(),
    userId,
    title,
    lists: [],
    createdAt: new Date().toISOString()
  };

  boards.push(newBoard);
  console.log(`📋 Quadro criado: ${title} (User: ${userId})`);

  res.json({ success: true, data: newBoard });
});

// Atualizar quadro
app.put('/api/boards/:id', (req, res) => {
  const { id } = req.params;
  const { title, lists } = req.body;

  const board = boards.find(b => b.id === id);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
  }

  if (title) board.title = title;
  if (lists) board.lists = lists;

  res.json({ success: true, data: board });
});

// ========== LISTAS ==========

// Criar lista
app.post('/api/boards/:boardId/lists', (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  const board = boards.find(b => b.id === boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
  }

  const newList = {
    id: Date.now().toString(),
    title,
    tasks: [],
    createdAt: new Date().toISOString()
  };

  board.lists.push(newList);
  console.log(`📝 Lista criada: ${title} (Quadro: ${board.title})`);

  res.json({ success: true, data: newList, board });
});

// ========== TAREFAS ==========

// Criar tarefa
app.post('/api/boards/:boardId/lists/:listId/tasks', (req, res) => {
  const { boardId, listId } = req.params;
  const { title, description, deadline, responsible } = req.body;

  const board = boards.find(b => b.id === boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
  }

  const list = board.lists.find(l => l.id === listId);
  if (!list) {
    return res.status(404).json({ success: false, message: 'Lista não encontrada' });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || '',
    deadline: deadline || '',
    responsible: responsible || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  list.tasks.push(newTask);
  console.log(`✅ Tarefa criada: ${title}`);

  res.json({ success: true, data: newTask, board });
});

// Atualizar tarefa
app.put('/api/boards/:boardId/lists/:listId/tasks/:taskId', (req, res) => {
  const { boardId, listId, taskId } = req.params;
  const { title, description, deadline, responsible, status } = req.body;

  const board = boards.find(b => b.id === boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
  }

  const list = board.lists.find(l => l.id === listId);
  if (!list) {
    return res.status(404).json({ success: false, message: 'Lista não encontrada' });
  }

  const task = list.tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
  }

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (deadline !== undefined) task.deadline = deadline;
  if (responsible !== undefined) task.responsible = responsible;
  if (status) task.status = status;

  console.log(`🔄 Tarefa atualizada: ${task.title}`);

  res.json({ success: true, data: task, board });
});

// Deletar tarefa
app.delete('/api/boards/:boardId/lists/:listId/tasks/:taskId', (req, res) => {
  const { boardId, listId, taskId } = req.params;

  const board = boards.find(b => b.id === boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
  }

  const list = board.lists.find(l => l.id === listId);
  if (!list) {
    return res.status(404).json({ success: false, message: 'Lista não encontrada' });
  }

  const taskIndex = list.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
  }

  const deletedTask = list.tasks.splice(taskIndex, 1)[0];
  console.log(`🗑️ Tarefa deletada: ${deletedTask.title}`);

  res.json({ success: true, message: 'Tarefa deletada', board });
});

// ========== ESTATÍSTICAS/DASHBOARD ==========

app.get('/api/statistics', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId é obrigatório' });
  }

  const userBoards = boards.filter(b => b.userId === userId);
  const allTasks = userBoards.flatMap(b => b.lists.flatMap(l => l.tasks));
  const today = new Date().toISOString().split('T')[0];

  const stats = {
    total: allTasks.length,
    overdue: allTasks.filter(t => t.deadline && t.deadline < today && t.status === 'pending').length,
    today: allTasks.filter(t => t.deadline === today && t.status === 'pending').length,
    soon: allTasks.filter(t => {
      if (!t.deadline || t.status !== 'pending') return false;
      const deadline = new Date(t.deadline);
      const todayDate = new Date(today);
      const diff = Math.ceil((deadline - todayDate) / (1000 * 60 * 60 * 24));
      return diff > 0 && diff <= 3;
    }).length,
    completed: allTasks.filter(t => t.status === 'completed').length,
    pending: allTasks.filter(t => t.status === 'pending').length,
  };

  res.json({ success: true, data: stats });
});

// Inicializar dados de exemplo
const initSampleData = () => {
  const sampleUser = {
    id: 'user1',
    email: 'admin@task.com',
    name: 'Admin',
    createdAt: new Date().toISOString()
  };
  users.push(sampleUser);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sampleBoard = {
    id: 'board1',
    userId: 'user1',
    title: 'Projeto Exemplo',
    lists: [
      {
        id: 'list1',
        title: 'A Fazer',
        tasks: [
          {
            id: 'task1',
            title: 'Tarefa Atrasada',
            description: 'Esta tarefa está atrasada',
            deadline: yesterday.toISOString().split('T')[0],
            responsible: 'Admin',
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            id: 'task2',
            title: 'Vence Hoje',
            description: 'Esta tarefa vence hoje',
            deadline: today.toISOString().split('T')[0],
            responsible: 'Admin',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'list2',
        title: 'Em Andamento',
        tasks: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'list3',
        title: 'Concluído',
        tasks: [],
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };

  boards.push(sampleBoard);
  console.log('✅ Dados de exemplo inicializados');
};

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`${'='.repeat(50)}\n`);
  
  initSampleData();
  
  console.log('📋 Endpoints disponíveis:');
  console.log('  POST   /api/auth/send-code');
  console.log('  POST   /api/auth/verify-code');
  console.log('  GET    /api/boards?userId=...');
  console.log('  POST   /api/boards');
  console.log('  PUT    /api/boards/:id');
  console.log('  POST   /api/boards/:boardId/lists');
  console.log('  POST   /api/boards/:boardId/lists/:listId/tasks');
  console.log('  PUT    /api/boards/:boardId/lists/:listId/tasks/:taskId');
  console.log('  DELETE /api/boards/:boardId/lists/:listId/tasks/:taskId');
  console.log('  GET    /api/statistics?userId=...');
  console.log(`\n${'='.repeat(50)}\n`);
});