import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Task from '../models/Task';

// @desc    Criar uma nova tarefa
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter todas as tarefas do usuário
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter uma tarefa específica
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Atualizar uma tarefa
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const { title, description, completed } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true, runValidators: true }
    );

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Excluir uma tarefa
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Tarefa não encontrada' });
      return;
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.user.toString() !== req.user.id) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tarefa removida' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
