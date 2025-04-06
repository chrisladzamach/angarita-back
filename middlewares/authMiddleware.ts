import { Request, Response, NextFunction } from 'express';
import  verifyToken  from '../middlewares/verifyToken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    let a = verifyToken(req, res);
    if(req.body.id ){
      next(); 
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
