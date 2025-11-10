const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const List = require('../models/List');

// Criar lista
router.post('/:boardId/lists', async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
    }

    const newList = new List({
      title,
      tasks: []
    });

    await newList.save();

    // Adicionar lista ao board
    board.lists.push(newList._id);
    await board.save();
    res.json({ success: true, data: newList });
  } catch (error) {
    console.error('Erro ao criar lista:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Atualizar lista
router.put('/:boardId/lists/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ success: false, message: 'Lista não encontrada' });
    }

    if (title) list.title = title;

    await list.save();

    res.json({ success: true, data: list });
  } catch (error) {
    console.error('Erro ao atualizar lista:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Deletar lista
router.delete('/:boardId/lists/:listId', async (req, res) => {
  try {
    const { boardId, listId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Quadro não encontrado' });
    }

    // Remover lista do board
    board.lists = board.lists.filter(list => list.toString() !== listId);
    await board.save();

    // Deletar lista e suas tasks
    const list = await List.findById(listId);
    if (list) {
      await Task.deleteMany({ _id: { $in: list.tasks } });
      await List.findByIdAndDelete(listId);
    }

    console.log(`🗑️ Lista deletada: ${list?.title}`);

    res.json({ success: true, message: 'Lista deletada' });
  } catch (error) {
    console.error('Erro ao deletar lista:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;