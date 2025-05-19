import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  id: string;
}

// Estendendo a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obter token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'defaultsecret'
      ) as JwtPayload;

      // Adicionar usuário ao request
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};
