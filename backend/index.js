const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
import connectDB from './config/db';
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');


// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Permitir apenas o frontend
  credentials: true
}));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.send('API está funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
