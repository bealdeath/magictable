import { Request, Response, NextFunction } from 'express';

const verifyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role; // Assume req.user is populated by authentication middleware
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export default verifyRole;
