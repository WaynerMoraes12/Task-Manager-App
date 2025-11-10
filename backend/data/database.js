// Banco de dados em memória
let users = [];
let boards = [];
let verificationCodes = {};

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

module.exports = {
  users,
  boards,
  verificationCodes,
  initSampleData
};