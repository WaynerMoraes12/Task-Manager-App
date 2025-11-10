const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

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
      });

    const allTasks = userBoards.flatMap(b => 
      b.lists.flatMap(l => l.tasks)
    );

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
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;