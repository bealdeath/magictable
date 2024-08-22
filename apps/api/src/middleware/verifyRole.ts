import { Request, Response, NextFunction } from 'express';

const verifyRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.sendStatus(401); // Unauthorized
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.sendStatus(403); // Forbidden
    }

    next();
  };
};

export default verifyRole;
