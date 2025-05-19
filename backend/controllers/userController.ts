import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

// Gerar token JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '30d',
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'Usuário já existe' });
      return;
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Autenticar usuário e obter token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email }) as IUser | null;

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password') as IUser | null;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
