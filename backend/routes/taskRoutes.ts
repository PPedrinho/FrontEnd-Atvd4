import express from 'express';
import { body } from 'express-validator';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Todas as rotas são protegidas
router.use(protect);

// Rota para criar tarefa
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('description').optional()
  ],
  createTask
);

// Rota para obter todas as tarefas do usuário
router.get('/', getTasks);

// Rota para obter uma tarefa específica
router.get('/:id', getTaskById);

// Rota para atualizar uma tarefa
router.put(
  '/:id',
  [
    body('title').optional(),
    body('description').optional(),
    body('completed').optional().isBoolean().withMessage('Completed deve ser um booleano')
  ],
  updateTask
);

// Rota para excluir uma tarefa
router.delete('/:id', deleteTask);

export default router;
