import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Rota de registro
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
  ],
  registerUser
);

// Rota de login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').exists().withMessage('Senha é obrigatória')
  ],
  loginUser
);

// Rota de perfil (protegida)
router.get('/profile', protect, getUserProfile);

export default router;
