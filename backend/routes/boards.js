const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const List = require('../models/List');
const Task = require('../models/Task');

// Buscar todos os quadros do usuário com populações
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId é obrigatório' });
    }

    const userBoards = await Board.find({ userId })
      .populate({
        path: 'lists',
        populate: {
          path: 'tasks',
          model: 'Task'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: userBoards });
  } catch (error) {
    console.error('Erro ao buscar quadros:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Criar quadro
router.post('/', async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ success: false, message: 'userId e title são obrigatórios' });
    }

    const newBoard = new Board({
      userId,
      title,
      lists: []
    });

    await newBoard.save();

    res.json({ success: true, data: newBoard });
  } catch (error) {
    console.error('Erro ao criar quadro:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Atualizar quadro
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
    }

    if (title) board.title = title;

    await board.save();

    res.json({ success: true, data: board });
  } catch (error) {
    console.error('Erro ao atualizar quadro:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Deletar quadro e suas dependências
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id).populate('lists');
    if (!board) {
      return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
    }

    // Deletar todas as tasks das lists
    for (const list of board.lists) {
      await Task.deleteMany({ _id: { $in: list.tasks } });
    }

    // Deletar todas as lists
    await List.deleteMany({ _id: { $in: board.lists } });

    // Deletar o board
    await Board.findByIdAndDelete(id);
    res.json({ success: true, message: 'Quadro e todos os dados relacionados deletados' });
  } catch (error) {
    console.error('Erro ao deletar quadro:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;