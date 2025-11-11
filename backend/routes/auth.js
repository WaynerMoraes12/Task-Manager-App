const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

// Rota de cadastro - envia código de verificação
router.post('/register', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      console.log('❌ Dados incompletos no registro');
      return res.status(400).json({
        success: false,
        message: 'Email e nome são obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Usuário já cadastrado:', email);
      return res.status(400).json({
        success: false,
        message: 'Usuário já cadastrado'
      });
    }
    else {
      const newUser = new User({ email, name, createdAt: new Date() });
      await newUser.save();
    }
    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Gerando código para ${email}: ${code}`);

    // Salvar código no MongoDB
    await VerificationCode.findOneAndUpdate(
      { email },
      { email, code, name },
      { upsert: true, new: true }
    );

    console.log('✅ Código salvo no banco de dados');

    res.json({
      success: true,
      message: 'Código de verificação enviado',
      code: code // Apenas para desenvolvimento - remover em produção
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota de login - envia código de verificação
router.post('/login', async (req, res) => {
  try {
    console.log('📧 Recebida requisição de LOGIN:', req.body);

    const { email } = req.body;

    if (!email) {
      console.log('❌ Email não fornecido no login');
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Verificar se usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(400).json({
        success: false,
        message: 'Usuário não encontrado. Faça o cadastro primeiro.'
      });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Gerando código para login ${email}: ${code}`);

    // Salvar código no MongoDB
    await VerificationCode.findOneAndUpdate(
      { email },
      { email, code, name: user.name },
      { upsert: true, new: true }
    );

    console.log('✅ Código de login salvo no banco de dados');

    res.json({
      success: true,
      message: 'Código de verificação enviado',
      code: code // Apenas para desenvolvimento - remover em produção
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para enviar código (alternativa)
router.post('/send-code', async (req, res) => {
  try {
    console.log('📧 Recebida requisição de SEND-CODE:', req.body);

    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email e nome são obrigatórios'
      });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Gerando código (send-code) para ${email}: ${code}`);

    // Salvar código no MongoDB
    await VerificationCode.findOneAndUpdate(
      { email },
      { email, code, name },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Código enviado com sucesso',
      code: code
    });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar código (comum para login e cadastro)
router.post('/verify-code', async (req, res) => {
  try {
    console.log('🔐 Recebida requisição de VERIFICAÇÃO:', req.body);

    const { email, code } = req.body;

    if (!email || !code) {
      console.log('❌ Dados incompletos na verificação');
      return res.status(400).json({
        success: false,
        message: 'Email e código são obrigatórios'
      });
    }

    // Buscar código no MongoDB
    const storedData = await VerificationCode.findOne({ email });
    if (!storedData) {
      console.log('❌ Código não encontrado para:', email);
      return res.status(400).json({
        success: false,
        message: 'Código não encontrado. Solicite um novo código.'
      });
    }

    console.log(`🔍 Código armazenado: ${storedData.code}, Código recebido: ${code}`);

    if (storedData.code !== code) {
      console.log('❌ Código incorreto para:', email);
      return res.status(400).json({
        success: false,
        message: 'Código incorreto'
      });
    }

    // Criar ou buscar usuário
    let user = await User.findOne({ email });
    if (!user) {
      console.log('👤 Criando novo usuário:', email);
      user = new User({
        email,
        name: storedData.name,
      });
      await user.save();
    } else {
      console.log('👤 Usuário existente encontrado:', user.name);
    }

    // Limpar código usado
    await VerificationCode.deleteOne({ email });
    console.log('✅ Código verificado e removido do banco');

    res.json({
      success: true,
      message: 'Autenticação realizada com sucesso',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('❌ Erro ao verificar código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
