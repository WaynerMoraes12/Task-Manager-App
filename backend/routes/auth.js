const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

// Gerar código de verificação
router.post('/send-code', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Email e nome são obrigatórios' });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Salvar ou atualizar código no MongoDB
    await VerificationCode.findOneAndUpdate(
      { email },
      { email, code, name },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Código enviado',
    });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Verificar código
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email e código são obrigatórios' });
    }

    // Buscar código no MongoDB
    const storedData = await VerificationCode.findOne({ email });
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'Código não encontrado' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ success: false, message: 'Código incorreto' });
    }

    // Criar ou buscar usuário
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name: storedData.name,
      });
      await user.save();
    }
    // Limpar código usado
    await VerificationCode.deleteOne({ email });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

module.exports = router;