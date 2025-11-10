const mongoose = require('mongoose');

// Carregar variáveis de ambiente
require('dotenv').config();

const connectDB = async () => {
  try {
    // Usar a URI do environment ou fallback para local
    const mongoURI = process.env.MONGODB_URI;
        
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;