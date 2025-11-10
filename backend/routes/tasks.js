const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');

// Criar tarefa
router.post('/:boardId/lists/:listId/tasks', async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    const { title, description, deadline, responsible } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ success: false, message: 'Lista não encontrada' });
    }

    const newTask = new Task({
      title,
      description: description || '',
      deadline: deadline || '',
      responsible: responsible || '',
      status: 'pending'
    });

    await newTask.save();

    // Adicionar tarefa à lista
    list.tasks.push(newTask._id);
    await list.save();
    // Retornar o board atualizado
    const updatedBoard = await Board.findById(boardId)
      .populate({
        path: 'lists',
        populate: {
          path: 'tasks',
          model: 'Task'
        }
      });

    res.json({ success: true, data: newTask, board: updatedBoard });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Atualizar tarefa
router.put('/:boardId/lists/:listId/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, deadline, responsible, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (responsible !== undefined) task.responsible = responsible;
    if (status) task.status = status;

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Deletar tarefa
router.delete('/:boardId/lists/:listId/tasks/:taskId', async (req, res) => {
  try {
    const { listId, taskId } = req.params;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ success: false, message: 'Lista não encontrada' });
    }

    // Remover tarefa da lista
    list.tasks = list.tasks.filter(task => task.toString() !== taskId);
    await list.save();

    // Deletar tarefa
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    res.json({ success: true, message: 'Tarefa deletada' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;