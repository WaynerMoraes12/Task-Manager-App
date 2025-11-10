// src/docs/swaggerDefinitions.js

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *           example: '123456789'
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: usuario@exemplo.com
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *           example: João Silva
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *           example: '2024-01-15T10:30:00.000Z'
 * 
 *     Board:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do quadro
 *           example: 'board_123'
 *         userId:
 *           type: string
 *           description: ID do usuário proprietário
 *           example: 'user_123'
 *         title:
 *           type: string
 *           description: Título do quadro
 *           example: Projeto Marketing
 *         lists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/List'
 *           description: Listas do quadro
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do quadro
 *           example: '2024-01-15T10:30:00.000Z'
 * 
 *     List:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da lista
 *           example: 'list_123'
 *         title:
 *           type: string
 *           description: Título da lista
 *           example: A Fazer
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *           description: Tarefas da lista
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da lista
 *           example: '2024-01-15T10:30:00.000Z'
 * 
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da tarefa
 *           example: 'task_123'
 *         title:
 *           type: string
 *           description: Título da tarefa
 *           example: Reunião com cliente
 *         description:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *           example: Preparar apresentação para reunião
 *         deadline:
 *           type: string
 *           format: date
 *           description: Prazo da tarefa (YYYY-MM-DD)
 *           example: '2024-01-20'
 *         responsible:
 *           type: string
 *           description: Responsável pela tarefa
 *           example: João Silva
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *           description: Status da tarefa
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da tarefa
 *           example: '2024-01-15T10:30:00.000Z'
 * 
 *     VerificationCode:
 *       type: object
 *       required:
 *         - email
 *         - code
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email para verificação
 *           example: usuario@exemplo.com
 *         code:
 *           type: string
 *           description: Código de 6 dígitos
 *           example: '123456'
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: João Silva
 *         timestamp:
 *           type: integer
 *           description: Timestamp de criação do código
 *           example: 1705311000000
 * 
 *     Statistics:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de tarefas
 *           example: 25
 *         overdue:
 *           type: integer
 *           description: Tarefas atrasadas
 *           example: 3
 *         today:
 *           type: integer
 *           description: Tarefas que vencem hoje
 *           example: 2
 *         soon:
 *           type: integer
 *           description: Tarefas que vencem em até 3 dias
 *           example: 5
 *         completed:
 *           type: integer
 *           description: Tarefas concluídas
 *           example: 10
 *         pending:
 *           type: integer
 *           description: Tarefas pendentes
 *           example: 15
 * 
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Mensagem de erro detalhada
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Operação realizada com sucesso
 *         data:
 *           type: object
 *           description: Dados retornados pela operação
 * 
 *   responses:
 *     NotFound:
 *       description: Recurso não encontrado
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Quadro não encontrado
 * 
 *     BadRequest:
 *       description: Requisição inválida
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Parâmetros obrigatórios faltando
 * 
 *     ServerError:
 *       description: Erro interno do servidor
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Erro interno do servidor
 */

// AUTH ENDPOINTS
/**
 * @openapi
 * /api/auth/send-code:
 *   post:
 *     summary: Envia código de verificação para o email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *               name:
 *                 type: string
 *                 example: João Silva
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Código enviado
 *                 code:
 *                   type: string
 *                   example: "123456"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @openapi
 * /api/auth/verify-code:
 *   post:
 *     summary: Verifica o código de autenticação
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// BOARDS ENDPOINTS
/**
 * @openapi
 * /api/boards:
 *   get:
 *     summary: Retorna todos os quadros do usuário
 *     tags: [Boards]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: user_123
 *     responses:
 *       200:
 *         description: Lista de quadros do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Board'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   post:
 *     summary: Cria um novo quadro
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_123
 *               title:
 *                 type: string
 *                 example: Meu Projeto
 *     responses:
 *       200:
 *         description: Quadro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Board'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @openapi
 * /api/boards/{id}:
 *   put:
 *     summary: Atualiza um quadro existente
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Novo Título do Projeto
 *               lists:
 *                 type: array
 *     responses:
 *       200:
 *         description: Quadro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Board'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// LISTS ENDPOINTS
/**
 * @openapi
 * /api/boards/{boardId}/lists:
 *   post:
 *     summary: Cria uma nova lista em um quadro
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: A Fazer
 *     responses:
 *       200:
 *         description: Lista criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/List'
 *                 board:
 *                   $ref: '#/components/schemas/Board'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// TASKS ENDPOINTS
/**
 * @openapi
 * /api/boards/{boardId}/lists/{listId}/tasks:
 *   post:
 *     summary: Cria uma nova tarefa em uma lista
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Reunião de planejamento
 *               description:
 *                 type: string
 *                 example: Preparar agenda para reunião
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-20
 *               responsible:
 *                 type: string
 *                 example: João Silva
 *     responses:
 *       200:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 board:
 *                   $ref: '#/components/schemas/Board'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @openapi
 * /api/boards/{boardId}/lists/{listId}/tasks/{taskId}:
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               responsible:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *                 board:
 *                   $ref: '#/components/schemas/Board'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   delete:
 *     summary: Remove uma tarefa
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tarefa deletada
 *                 board:
 *                   $ref: '#/components/schemas/Board'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

// STATISTICS ENDPOINTS
/**
 * @openapi
 * /api/statistics:
 *   get:
 *     summary: Retorna estatísticas das tarefas do usuário
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: user_123
 *     responses:
 *       200:
 *         description: Estatísticas das tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Statistics'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */